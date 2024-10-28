import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    VStack,
    HStack,
    Text,
    Box,
} from "@chakra-ui/react";
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import { ModalUpload } from "./ModalUpload.js";
import { useParams } from "react-router-dom";
import { Suspense, useState } from "react";
import { Loader } from "@/components/Loader.js";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useDeleteFile, useGetCustomer, useGetCustomerFiles } from "./api.js";
import { notify } from "@/components/notify.js";
import { ModalRename } from "./ModalRename.js";

export const Anexos = () => {
    return (
        <VStack>
            <Suspense fallback={<Loader />}>
                <HStack w="100%">
                    <Armazenamento />
                    <ModalUpload />
                </HStack>
                <Tabela />
            </Suspense>
        </VStack>
    );
};

export const Armazenamento = () => {
    const { customerId } = useParams();
    const queryClient = useQueryClient();
    const { data } = useSuspenseQuery({
        queryKey: ["get-customer"],
        queryFn: () => useGetCustomer(customerId!),
    });

    return (
        <HStack w="100%">
            <Text fontSize="smaller" w="fit-content">
                Em uso: {data.porcentagemDeUso}% de {data.espacoContratado}MB
            </Text>
            <Box w="100%" h="10px" bg="lightgrey" borderRadius="5px">
                <Box
                    w={data.porcentagemDeUso <= 100 ? `${data.porcentagemDeUso}%` : "100%"}
                    bg={data.porcentagemDeUso > 75 ? "red" : "limegreen"}
                    h="10px"
                    borderRadius="5px"
                ></Box>
            </Box>
        </HStack>
    );
};

export type TArquivo = {
    description: string;
    original_name: string;
    id: number;
};

const Tabela = () => {
    const { customerId } = useParams();
    const queryClient = useQueryClient();
    const { data } = useSuspenseQuery({
        queryKey: ["get-files"],
        queryFn: () => useGetCustomerFiles(customerId!),
    });

    const { mutate } = useMutation({
        mutationFn: async (fileId: number) => useDeleteFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-files"] });
            queryClient.invalidateQueries({ queryKey: ["get-customer"] });

            notify("Arquivo excluído com sucesso!", "success");
        },
    });

    if (data.length >= 1)
        return (
            <TableContainer w="100%" bg="white">
                <Table variant="simple">
                    <TableCaption>Documentos armazenados</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Descrição</Th>
                            <Th>Nome original</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((arquivo) => {
                            return (
                                <Tr key={Math.random()}>
                                    <Td>{arquivo.description}</Td>
                                    <Td>{arquivo.original_name}</Td>
                                    <Td justifyContent={"center"} columnGap={1} display={"flex"}>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                window.open(
                                                    `${import.meta.env.VITE_API_URL}/customer/file/${arquivo.id}`
                                                )
                                            }
                                            leftIcon={<DownloadIcon />}
                                        >
                                            Baixar
                                        </Button>
                                        <ModalRename fileId={arquivo.id} fileDescription={arquivo.description} />
                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() => mutate(arquivo.id)}
                                            leftIcon={<DeleteIcon />}
                                        >
                                            Deletar
                                        </Button>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    return <h1>Nenhum documento no momento</h1>;
};

