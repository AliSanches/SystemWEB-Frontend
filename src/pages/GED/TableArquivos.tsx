import { Button, VStack, Tag, HStack, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { ModalRename } from "./ModalRename.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteFile } from "./api.js";
import { notify } from "@/components/notify.js";
import useDarkMode from "../../stores/useDarkMode.js";

export const TableArquivos = ({ data }) => {
    const queryClient = useQueryClient();
    const colors = useDarkMode((state) => state.colors);

    const { mutate } = useMutation({
        mutationFn: async (fileId: number) => useDeleteFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-gedArmazenamento"] });
            queryClient.invalidateQueries({ queryKey: ["get-ged"] });

            notify("Documento excluído com sucesso!", "success");
        },
    });

    return (
        <>
            <VStack alignItems="left" rowGap="0" w="100%">
                <HStack w="100%" borderRadius="5px" bg={colors.bg} padding="15px" mb={2}>
                    <VStack alignItems="left" rowGap="0" w="45%">
                        <Text fontSize="md">{data.description}</Text>
                    </VStack>
                    <HStack w="25%" bg="transparent" textAlign="left">
                        <Tag colorScheme={"blue"}>{data.original_name}</Tag>
                    </HStack>
                    <Button
                        size="sm"
                        onClick={() => window.open(`${import.meta.env.VITE_API_URL}/ged/file/${data.id}`)}
                    >
                        Baixar
                    </Button>
                    <ModalRename fileId={data.id} fileDescription={data.description} />
                    <Button colorScheme="red" size="sm" leftIcon={<DeleteIcon />} onClick={() => mutate(data.id)}>
                        Deletar
                    </Button>
                </HStack>
            </VStack>
        </>
    );
};

