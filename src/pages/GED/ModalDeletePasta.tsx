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
    Text,
} from "@chakra-ui/react";
import { notify } from "@/components/notify.js";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder, getFilterPasta } from "./api.js";
import { useState } from "react";
import useDarkMode from "../../stores/useDarkMode.js";

export const ModalDeletePasta = ({ pasta }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const queryClient = useQueryClient();

    const [descricao, setDescricao] = useState(pasta.titulo);
    const [showAviso, setShowAviso] = useState(false);

    const { data: arquivos } = useSuspenseQuery({
        queryKey: ["get-ged", pasta.id],
        queryFn: () => getFilterPasta(pasta.id),
    });

    const { mutate } = useMutation({
        mutationFn: async () => deleteFolder(pasta.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-data"] });
            onClose();
            setDescricao("");

            notify("Pasta deletada com sucesso!", "success");
        },
    });

    const handleExcluir = () => {
        if (arquivos.length) {
            setShowAviso(true);
        } else {
            mutate();
        }
    };

    return (
        <Flex w="100%" h="10px" justifyContent="right">
            <Button colorScheme="red" size="sm" onClick={onOpen}>
                Deletar
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Deletar</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack mb={2}>
                            <FormLabel>Nome:</FormLabel>
                            <Input size="sm" required value={descricao} disabled />
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Voltar
                        </Button>

                        <Button colorScheme="red" onClick={handleExcluir}>
                            Excluir
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {showAviso && <AvisoExcluirPasta onClose={() => setShowAviso(false)} />}
        </Flex>
    );
};

const AvisoExcluirPasta = ({ onClose }) => {
    const colors = useDarkMode((state) => state.colors);

    return (
        <Modal isOpen={true} onClose={() => {}} isCentered>
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>Aviso</ModalHeader>
                <ModalBody>
                    <Text>Para excluir uma pasta é preciso primeiramente apagar os arquivos dentro dela</Text>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" mr="auto" onClick={onClose}>
                        Voltar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

