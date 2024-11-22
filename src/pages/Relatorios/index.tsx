import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, VStack } from "@chakra-ui/react";

import { RelatorioClientes } from "./Clientes/Relatorio-Clientes.js";

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

