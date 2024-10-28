import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    IconButton,
    Input,
    FormLabel,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpload } from "./api.js";
import { notify } from "@/components/notify.js";

export function ModalUpload() {
    const [descricao, setDescricao] = useState("");
    const [files, setFile]: [files: any[], setFile: any] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { customerId } = useParams() as { customerId: string };

    const onClose = () => {
        setOpen(false);
        setDescricao("");
        setFile([]);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: () => useUpload(customerId, files, descricao),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-files"] });
            queryClient.invalidateQueries({ queryKey: ["get-customer"] });
            notify("Arquivo salvo com sucesso!", "success");
            onClose();
        },
        onError: (err: any) => {
            if (err.response.status == 507) notify("Armazenamento Cheio!", "error");
            else notify("Erro ao enviar arquivo", "error");
        },
    });

    return (
        <>
            <IconButton onClick={() => setOpen(true)} ml="auto" colorScheme="blue" aria-label="Adicionar arquivo">
                <AddIcon />
            </IconButton>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Enviar um Arquivo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack mb={2}>
                            <FormLabel>Descrição:</FormLabel>
                            <Input
                                size="sm"
                                value={descricao}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") mutate();
                                }}
                                onChange={(event) => setDescricao(event.target.value)}
                            />
                        </HStack>
                        <input type="file" onChange={(event) => setFile(event.target.files)} />
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Voltar
                        </Button>
                        {isPending ? (
                            <div>
                                <Spinner color="green" />
                            </div>
                        ) : (
                            <Button colorScheme="green" onClick={() => mutate()}>
                                Enviar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

