import {
    Button,
    Flex,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    Input,
    FormLabel,
} from "@chakra-ui/react";
import { notify } from "@/components/notify.js";
import { AddIcon } from "@chakra-ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpload } from "./api.js";
import { useState } from "react";

export const ModalCreateDocument = ({ pasta }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();

    const [pastaUsuario, setPastaUsuario] = useState(pasta.id);
    const [descricao, setDescricao] = useState("");
    const [files, setFile]: [files: any[], setFile: any] = useState([]);

    const { mutate } = useMutation({
        mutationFn: () => useUpload(files, descricao, pastaUsuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-files"] });
            queryClient.invalidateQueries({ queryKey: ["get-gedArmazenamento"] });
            queryClient.invalidateQueries({ queryKey: ["get-ged"] });
            notify("Arquivo salvo com sucesso!", "success");
            setDescricao("");
            onClose();
        },
        onError: (err: any) => {
            if (err.response.status == 507) notify("Armazenamento Cheio!", "error");
            else notify("Erro ao enviar arquivo", "error");
        },
    });

    return (
        <Flex w="100%" h="10px" justifyContent="right">
            <Button colorScheme={"linkedin"} size="sm" w={7} onClick={onOpen}>
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Enviar documento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex mb={2} flexDirection="column" textAlign="left">
                            <FormLabel>Nome da Pasta:</FormLabel>
                            <Input mb={3} size="sm" value={pastaUsuario.titulo} defaultValue={pasta.titulo} disabled />
                            <FormLabel>Nome do Arquivo:</FormLabel>
                            <Input
                                mb={3}
                                size="sm"
                                value={descricao}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") mutate();
                                }}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </Flex>
                        <input type="file" onChange={(event) => setFile(event.target.files)} />
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Voltar
                        </Button>

                        <Button colorScheme="red" onClick={() => mutate()}>
                            Enviar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

