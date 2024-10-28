import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";
import { deletaSubcategoria } from "./api.js";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import ConfirmDeletion from "../../components/ConfirmDeletionModal.js";

export const SubCategoriaDelete = ({ id, reloadData, qtdAnotacoes }) => {
    const colors = useDarkMode((state) => state.colors);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleDeletion = async () => {
        try {
            const request = await deletaSubcategoria(id, navigate);

            if (request.status === 200) {
                reloadData();
                notify("Subcategoria deletada", "success");
                onClose();
            } else {
                notify("Erro", "error");
            }
        } catch {
            notify("Erro", "error");
        }
    };

    if (qtdAnotacoes)
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
                                Não é possível deletar uma Subcategoria que ainda contenha anotações vinculadas
                            </Text>
                            <Text>
                                <br />
                                Para continuar delete as anotações restantes
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
    else return <ConfirmDeletion entity="Subcategoria" text="" handleDeletion={handleDeletion} mt={0} />;
};

