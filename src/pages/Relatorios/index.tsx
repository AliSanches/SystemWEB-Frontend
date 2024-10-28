import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Text,
    VStack,
} from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";

export const Relatorios = () => {
    return (
        <VStack w="100%" alignItems="left">
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Relatórios</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <RelatorioClientes />
        </VStack>
    );
};

const RelatorioClientes = () => {
    const colors = useDarkMode((state) => state.colors);

    const geraRelatorio = () => {
        window.open(`${import.meta.env.VITE_API_URL}/relatorios/1`, "_blank");
    };

    return (
        <Card size="sm" bg={colors.bg} color={colors.text}>
            <CardHeader>
                <Text fontWeight="bold">Listagem de clientes</Text>
            </CardHeader>
            <CardBody>
                Emite uma listagem com todos os clientes cadastrados no sistema, contendo seu nome, gênero, e data de
                nascimento.
            </CardBody>
            <CardFooter>
                <Button ml="auto" size="sm" colorScheme="linkedin" onClick={geraRelatorio}>
                    Emitir
                </Button>
            </CardFooter>
        </Card>
    );
};

