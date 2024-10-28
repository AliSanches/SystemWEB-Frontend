import {
    Modal,
    ModalHeader,
    useDisclosure,
    Button,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Text,
    Spinner,
    ModalCloseButton,
} from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import useDarkMode from "../../stores/useDarkMode";
import { deletarTarefa } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

export const ModalDeletarTarefa = ({ id, reload }: { id: number; reload: Function }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleDeletion = async () => {
        setLoading(true);

        const response = await deletarTarefa(navigate, id);
        if (response.status === 200) {
            notify("Tarefa deletada com sucesso!", "success");
            setLoading(false);
            reload();
            onClose();
        } else {
            notify("Erro ao deletar", "error");
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />

                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalCloseButton />
                    <ModalHeader flexDir="row" display="flex" alignItems="center">
                        Deletar tarefa ?
                    </ModalHeader>
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FiAlertTriangle size="3em" color="red" />
                        <Text></Text>
                    </ModalBody>
                    <ModalFooter>
                        {loading ? (
                            <Spinner color="red" margin="auto" />
                        ) : (
                            <Button
                                colorScheme={"red"}
                                width="100%"
                                size="sm"
                                onClick={() => {
                                    setLoading(true);
                                    handleDeletion();
                                }}
                            >
                                Sim, deletar esta tarefa
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button colorScheme={"red"} onClick={onOpen} ml={1} size="sm">
                Deletar
            </Button>
        </>
    );
};

