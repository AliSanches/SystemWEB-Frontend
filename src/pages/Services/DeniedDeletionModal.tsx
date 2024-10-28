import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";
import useDarkMode from "../../stores/useDarkMode";

export const DeniedDeletionModal = () => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);

    return (
        <Box ml="auto">
            <Button size="sm" colorScheme="red" onClick={onOpen}>
                Deletar
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalCloseButton />
                    <ModalHeader>Aviso</ModalHeader>
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FiAlertTriangle size="3em" color="orange" />
                        <Text>
                            <br />
                            Não é possível remover um serviço que ainda contenha processos vinculados
                        </Text>
                        <Text>
                            <br />
                            Para continuar encerre e delete os processos vinculados a esse serviço
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" onClick={onClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

