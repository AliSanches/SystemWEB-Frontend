import { VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Suspense } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { PersonalData } from "./PersonalData";
import { Employment } from "./Employment";
import { Regras } from "./Regras";
import { Processos } from "./Processos";
import useUserStore from "../../../stores/user";
import { AccessDenied } from "../../../components/AccessDenied";
import { Contratos } from "./Contratos";
import { Anexos } from "./Anexos";
import { useNavigate, useParams } from "react-router-dom";
import { listEmployments } from "./api.js";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Details(): JSX.Element {
    const permissions = useUserStore((state) => state.permissions);
    return permissions.clientes >= 1 ? (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/clientes">Clientes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Detalhes</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Suspense fallback={<h1>Loading...</h1>}>
                <TabCreator />
            </Suspense>
        </VStack>
    ) : (
        <AccessDenied />
    );
}

const TabCreator = () => {
    const { customerId } = useParams() as { customerId: string };
    const permissions = useUserStore((state) => state.permissions);
    const navigate = useNavigate();

    let { data } = useSuspenseQuery({
        queryKey: ["list-employments"],
        queryFn: () => listEmployments(customerId, navigate),
    });

    let tabs = [
        {
            label: "Cadastro",
            content: <PersonalData />,
        },
        {
            label: "Vínculos Trabalhistas",
            content: <Employment />,
        },
        {
            label: "Anexos",
            content: <Anexos />,
        },
    ];

    if (data.data.employments.length >= 1) {
        tabs.push({
            label: "Regras Previdenciárias",
            content: <Regras />,
        });
    }

    permissions.processos >= 1 &&
        tabs.push({
            label: "Processos",
            content: <Processos />,
        });

    permissions.contratos >= 1 &&
        tabs.push({
            label: "Contratos",
            content: <Contratos />,
        });

    return (
        <Tabs size="sm" isLazy={true} variant="enclosed-colored">
            <TabList>
                {tabs.map((tab, index) => (
                    <Tab key={index}>{tab.label}</Tab>
                ))}
            </TabList>
            <TabPanels>
                {tabs.map((tab, index) => (
                    <TabPanel key={index}>{tab.content}</TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
};

