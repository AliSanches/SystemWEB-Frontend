import {
    Button,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useDarkMode from "../../stores/useDarkMode";
import { encerraProcesso } from "./api";
import { notify } from "../../components/notify";
import { useNavigate, useParams } from "react-router-dom";

export const ModalEncerrarProcesso = ({ reloadData }: { reloadData: Function }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [texto, setTexto] = useState("");
    const colors = useDarkMode((state) => state.colors);
    const { processId } = useParams() as { processId: string };
    const navigate = useNavigate();

    const handleFinish = async () => {
        try {
            const query = await encerraProcesso(processId, { texto }, navigate);
            if (query.status === 200) {
                notify("Processo encerrado com sucesso!", "success");
                reloadData();
                onClose();
            }
        } catch {
            notify("Erro ao encerrar processo!", "error");
        }
    };

    return (
        <VStack>
            <Button size="sm" colorScheme={"red"} onClick={onOpen}>
                Encerrar
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalCloseButton />

                    <ModalHeader>Encerrar processo</ModalHeader>

                    <ModalBody>
                        <FormLabel mt={3}>Comentário</FormLabel>
                        <Textarea size="sm" onChange={(event) => setTexto(event.target.value)} value={texto} />
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" colorScheme={"linkedin"} onClick={handleFinish}>
                            Encerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

