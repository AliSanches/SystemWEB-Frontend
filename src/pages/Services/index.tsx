import { VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Spinner, HStack, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useDarkMode from "../../stores/useDarkMode.js";
import { listAllServices } from "./api.js";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ServiceCard } from "./ServiceCard.js";
import useUserStore from "../../stores/user.js";

export const Services = () => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        const request = await listAllServices(navigate);
        setLoading(false);

        if (request.status === 200) return setServices(request.data);
        else return setServices([]);
    };

    const [services, setServices] = useState(() => fetchServices());

    return (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Serviços</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {permissions.servicos === 2 ? (
                <VStack>
                    <Button
                        size="sm"
                        marginLeft="auto"
                        colorScheme={"linkedin"}
                        _hover={{ bg: colors.buttonHover }}
                        onClick={() => navigate("/app/serviços/cadastro")}
                    >
                        Adicionar
                    </Button>
                    <Outlet context={fetchServices} />
                </VStack>
            ) : null}
            {loading ? (
                <HStack w="100%" justifyContent="center">
                    <Spinner color={colors.default} size="lg" />
                </HStack>
            ) : (
                <>
                    <VStack w="100%">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} reloadData={fetchServices} />
                        ))}
                    </VStack>
                    {services.length === 0 && <Text alignSelf="center">Nenhum serviço cadastrado</Text>}
                </>
            )}
        </VStack>
    );
};

