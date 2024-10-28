import {
    Button,
    HStack,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPasta } from "./api.js";
import { useState } from "react";

export const ModalCreatePasta = () => {
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [descricao, setDescricao] = useState("");

    const { mutate } = useMutation({
        mutationFn: async () => createPasta(descricao),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-data"] });
            onClose();
            setDescricao("");

            notify("Pasta criada com sucesso!", "success");
        },
    });

    return (
        <Flex w="100%" justifyContent="right">
            <Button colorScheme={"linkedin"} size="sm" onClick={onOpen}>
                Nova Pasta
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Pasta</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack mb={2}>
                            <FormLabel>Nome:</FormLabel>
                            <Input
                                size="sm"
                                required
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Voltar
                        </Button>
                        <Button colorScheme="green" onClick={() => mutate()}>
                            Enviar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

