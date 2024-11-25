import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Flex,
    Box,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useDarkMode from "../../stores/useDarkMode.js";
import { useState, Suspense, useEffect } from "react";
import { updateConfigs } from "./api.js";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify.js";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useGetConfig } from "./api.js";

export const Configuracoes = () => {
    return (
        <Suspense fallback={<h1>carregando</h1>}>
            <CompanyData />
        </Suspense>
    );
};

const CompanyData = () => {
    const { data } = useSuspenseQuery({ queryKey: ["get-config"], queryFn: useGetConfig, staleTime: 1 });
    const [formData, setFormData] = useState({ ...data });

    const formReducer = (item: string, data: string) => {
        let newData = { ...formData };
        newData[item] = data;

        setFormData({ ...newData });
    };

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: () => updateConfigs(formData, navigate),
        onSuccess: () => {
            notify("Configurações atualizadas com sucesso", "success");
        },
        onError: () => notify("Erro ao salvar", "error"),
    });

    return (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
            rowGap={3}
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Configurações</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <FormControl>
                <FormLabel>Empresa</FormLabel>
                <Input
                    bg={colors.bg}
                    size="sm"
                    value={formData.empresa}
                    onChange={(event) => formReducer("empresa", event.target.value)}
                />

                <Flex flexWrap="wrap" justifyContent="flex-start" width="100%" marginTop="10px" gap={5}>
                    <Box minW={320} flex={3}>
                        <FormLabel>CNPJ</FormLabel>
                        <Input
                            bg={colors.bg}
                            placeholder="99.999.999/0001-99"
                            size="sm"
                            value={formData.cnpj}
                            onChange={(event) => formReducer("cnpj", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Razão Social</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.razaoSocial}
                            onChange={(event) => formReducer("razaoSocial", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Inscrição Estadual (IE)</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.registroEstadual}
                            onChange={(event) => formReducer("registroEstadual", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Inscrição Municipal (IM)</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.registroMunicipal}
                            onChange={(event) => formReducer("registroMunicipal", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Cep</FormLabel>
                        <Input
                            bg={colors.bg}
                            placeholder="99999-999"
                            size="sm"
                            value={formData.postalCode}
                            onChange={(event) => formReducer("postalCode", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>UF</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.state}
                            onChange={(event) => formReducer("state", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Cidade</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.city}
                            onChange={(event) => formReducer("city", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Bairro</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.neighborhood}
                            onChange={(event) => formReducer("neighborhood", event.target.value)}
                        ></Input>
                    </Box>

                    <Box minW={320} flex={3}>
                        <FormLabel>Rua</FormLabel>
                        <Input
                            size="sm"
                            bg={colors.bg}
                            value={formData.street}
                            onChange={(event) => formReducer("street", event.target.value)}
                        ></Input>
                    </Box>

                    <Box maxW={320} flex={1}>
                        <FormLabel>Número</FormLabel>
                        <Input
                            bg={colors.bg}
                            placeholder="9999"
                            size="sm"
                            value={formData.buildingNumber}
                            onChange={(event) => formReducer("buildNumber", event.target.value)}
                        ></Input>
                    </Box>
                </Flex>
                <Flex display="flex" justifyContent="end">
                    <Button mt={5} size="sm" colorScheme={"linkedin"} onClick={() => mutate()}>
                        Enviar
                    </Button>
                </Flex>
            </FormControl>
        </VStack>
    );
};

