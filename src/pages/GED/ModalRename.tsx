import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    Input,
    FormLabel,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { EditIcon } from "@chakra-ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRenameFile } from "./api.js";
import { notify } from "@/components/notify.js";

export function ModalRename({ fileId, fileDescription }: { fileId: number; fileDescription: string }) {
    const [descricao, setDescricao] = useState(fileDescription);
    const [isOpen, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const onClose = () => {
        setOpen(false);
        setDescricao("");
    };

    const { mutate, isPending } = useMutation({
        mutationFn: () => useRenameFile(fileId, descricao),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-ged"] });
            notify("Arquivo salvo com sucesso!", "success");
            onClose();
        },
        onError: () => notify("Erro ao renomear arquivo", "error"),
    });

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)} leftIcon={<EditIcon />}>
                Renomear
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Renomear arquivo</ModalHeader>
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

