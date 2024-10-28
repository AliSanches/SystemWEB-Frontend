import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Code, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import useDarkMode from "../../stores/useDarkMode";
import { create } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

export const CadastroContrato = () => {
    const [titulo, setTitulo] = useState("");
    const [contrato, setContrato] = useState("");
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const createContrato = async () => {
        let request = await create({ contrato, titulo }, navigate);

        if (request.status === 200) {
            notify("Contrato cadastrado!", "success");
            navigate("/app/contratos");
        }
    };

    return (
        <VStack alignItems={"flex-start"}>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/contratos">Contratos</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Cadastro</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Text mt={3}>Título</Text>
            <Input
                size="sm"
                bg={colors.bg}
                placeholder="Titulo do contrato"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
            />

            <Text mt={3}>
                Utilize as tags abaixo para que o sistema as substitui automaticamente no momento da emissão do contrato
            </Text>

            <VStack alignItems="left" mt={3} mb={3}>
                <Code colorScheme="linkedin">{"{{CPF}} = CPF do cliente"}</Code>
                <Code colorScheme="linkedin">{"{{NOME}} = Nome completo do cliente"}</Code>
                <Code colorScheme="linkedin">
                    {"{{EMPRESA}} = Nome da empresa que foi definido no menu de configurações"}
                </Code>
                <Code colorScheme="linkedin">
                    {"{{CNPJ}} = CNPJ da empresa que foi definido no menu de configurações"}
                </Code>
            </VStack>

            <SunEditor
                //lang={"pt_br"}
                setOptions={{ buttonList: buttonList.complex }}
                defaultValue={contrato}
                onChange={(text) => setContrato(text)}
            />

            <Button size="sm" ml="auto" colorScheme="linkedin" onClick={() => createContrato()}>
                Salvar
            </Button>
        </VStack>
    );
};

