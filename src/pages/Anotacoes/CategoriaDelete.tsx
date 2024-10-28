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
import { FiAlertTriangle } from "react-icons/fi";
import useDarkMode from "../../stores/useDarkMode";
import ConfirmDeletion from "../../components/ConfirmDeletionModal";
import { deletaCategoria } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

export const CategoriaDelete = ({ count, id, reloadData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);

    const navigate = useNavigate();

    const handleDeletion = async () => {
        try {
            const request = await deletaCategoria(id, navigate);

            if (request.status === 200) {
                reloadData();
                notify("Categoria deletada", "success");
                onClose();
            } else {
                notify("Erro", "error");
            }
        } catch {
            notify("Erro", "error");
        }
    };

    if (count)
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
                                Não é possível deletar uma categoria que ainda contenha anotações vinculadas
                            </Text>
                            <Text>
                                <br />
                                Para continuar delete as anotações restantes, ou migre-as para outra categoria
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
    else return <ConfirmDeletion entity="Categoria" text="" handleDeletion={handleDeletion} />;
};

