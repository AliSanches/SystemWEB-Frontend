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
import useDarkMode from "../stores/useDarkMode";
import { useState } from "react";

const ConfirmDeletion = ({ entity, text, handleDeletion, mt }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);

    const [loading, setLoading] = useState(false);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />

                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalCloseButton />
                    <ModalHeader flexDir="row" display="flex" alignItems="center">
                        Deletar {entity} ?
                    </ModalHeader>
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FiAlertTriangle size="3em" color="red" />
                        <Text>{text}</Text>
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
                                Sim, desejo deletar essa {entity}
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Button colorScheme={"red"} onClick={onOpen} ml={{ base: "0", sm: "auto" }} size="sm" mt={mt}>
                Deletar
            </Button>
        </>
    );
};

export default ConfirmDeletion;

