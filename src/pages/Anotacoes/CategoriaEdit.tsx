import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { editaCategoria } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import useDarkMode from "../../stores/useDarkMode";
import { FiEdit } from "react-icons/fi";

export const CategoriaEdit = ({ categoria, reloadData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [titulo, setTitulo] = useState(categoria.titulo);
    const [descricao, setDescricao] = useState(categoria.descricao);
    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);

    const handleClose = () => {
        setDescricao(categoria.descricao);
        setTitulo(categoria.titulo);
        onClose();
    };

    const handleSave = async () => {
        try {
            if (titulo === "") {
                notify("Insira um título", "error");
                return;
            }

            const data = {
                titulo: titulo,
                descricao: descricao,
            };

            const response = await editaCategoria(categoria.id, data, navigate);

            if (response.status === 200) {
                reloadData();
                notify("Categoria editada com sucesso", "success");
                onClose();
            } else {
                notify("Erro ao editar categoria", "error");
            }
        } catch {
            notify("Erro ao editar categoria", "error");
        }
    };

    return (
        <>
            <Tooltip label="Editar categoria">
                <IconButton size="sm" aria-label="deletar usuários" icon={<FiEdit />} onClick={onOpen} />
            </Tooltip>

            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>
                        Editar categoria
                        <ModalCloseButton />
                    </ModalHeader>

                    <ModalBody>
                        <FormControl>
                            <FormLabel>Título</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                placeholder="Título"
                                value={titulo}
                                onChange={(event) => setTitulo(event.target.value)}
                            />

                            <FormLabel mt={3}>Descrição</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                placeholder="Descrição"
                                value={descricao}
                                onChange={(event) => setDescricao(event.target.value)}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" colorScheme={"linkedin"} onClick={handleSave}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

