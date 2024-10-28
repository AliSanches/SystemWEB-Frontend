import {
    Modal,
    Button,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    ModalHeader,
    ModalBody,
    Input,
    FormControl,
    FormLabel,
    ModalFooter,
    Spinner,
    IconButton,
    ModalCloseButton,
    Checkbox,
    Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { updateService } from "./api";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import { FiEdit } from "react-icons/fi";

export default function UpdateService({ reloadData, service }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(service.name);
    const [enabled, setEnabled] = useState(service.enabled);

    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const handleUpdate = async () => {
        setLoading(true);
        const response = await updateService({ name, id: service.id, enabled }, navigate);
        if (response.status === 200) {
            notify("Serviço atualizado com sucesso", "success");
            reloadData();
            handleClose();
        } else {
            notify(response.data, "warning");
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
    };

    return (
        <>
            <Tooltip label="Editar serviço">
                <IconButton size="sm" aria-label="editar serviço" icon={<FiEdit />} onClick={onOpen} />
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Atualizar serviço</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel htmlFor="input-name">Nome</FormLabel>
                            <Input
                                size="sm"
                                id="input-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <Checkbox mt="3" isChecked={enabled} onChange={(event) => setEnabled(event.target.checked)}>
                                Habilitado
                            </Checkbox>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        {loading ? (
                            <Spinner color={colors.default} />
                        ) : (
                            <Button size="sm" colorScheme={"linkedin"} onClick={handleUpdate}>
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

