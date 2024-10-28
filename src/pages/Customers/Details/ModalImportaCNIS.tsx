import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { uploadCNIS } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../../components/notify";
import useDarkMode from "../../../stores/useDarkMode";

function assert(condition: any): asserts condition {
    if (!condition) {
        throw new Error();
    }
}
export const ModalImportaCNIS = ({ reload }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const [files, setFiles]: [File[], React.Dispatch<React.SetStateAction<File[]>>] = useState([]);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const { customerId } = useParams();

    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);

    const handleUpload = async () => {
        try {
            setLoading(true);
            const body = new FormData();
            body.append("cnis", files[0]);

            assert(typeof customerId === "string");

            let response = await uploadCNIS(body, customerId, navigate);
            if (response.status === 200) {
                notify("Extrato importado com sucesso", "success");
                setLoading(false);
                handleClose();
                reload();
            } else throw new Error();
        } catch {
            notify("Erro ao importar o extrato", "error");
            setLoading(false);
        }
    };

    const handleClose = () => {
        let array = [];
        setFiles(array);
        onClose();
    };

    return (
        <VStack ml={"auto"}>
            <Button size="sm" colorScheme={"linkedin"} onClick={onOpen}>
                Importar Extrato
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Importar extrato CNIS</ModalHeader>
                    <ModalBody>
                        <p>Anexe o extrato resumido em formato PDF</p>
                        <input
                            type={"file"}
                            accept={"application/pdf"}
                            onChange={(event) => {
                                event.target.files && setFiles([event.target.files[0]]);
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        {loading ? (
                            <Spinner ml={"auto"} color={colors.default} />
                        ) : (
                            <Button isDisabled={files.length === 0} colorScheme={"linkedin"} onClick={handleUpload}>
                                Enviar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};
