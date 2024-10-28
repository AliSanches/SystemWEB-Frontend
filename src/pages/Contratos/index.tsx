import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, VStack, Text } from "@chakra-ui/react";
import { ContratoCard } from "./ContratoCard";
import { useNavigate } from "react-router-dom";
import { listContratos } from "./api";
import { useState } from "react";
import { Loader } from "../../components/Loader";

export const Contratos = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        let data = await listContratos();
        data = data.data;

        setContratos(data);
        setLoading(false);
    };

    const [contratos, setContratos]: [any, any] = useState(fetchData);

    return (
        <VStack alignItems="flex-start">
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Contratos</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Button size="sm" colorScheme="linkedin" ml="auto" onClick={() => navigate("cadastro")}>
                Adicionar
            </Button>

            {contratos.length >= 1 &&
                contratos.map((contrato) => {
                    return (
                        <ContratoCard
                            key={Math.random()}
                            titulo={contrato.titulo}
                            id={contrato.id}
                            reload={fetchData}
                        />
                    );
                })}
            {loading && <Loader />}
            {!loading && contratos.length === 0 && <Text alignSelf="center">Nenhum contrato cadastrado</Text>}
        </VStack>
    );
};

