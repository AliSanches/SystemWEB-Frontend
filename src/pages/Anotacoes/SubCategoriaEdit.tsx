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
    Select,
} from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { listaCategoriasSelect } from "./api.js";
import { notify } from "../../components/notify";
import { useNavigate } from "react-router-dom";
import { editaSubcategoria } from "./api.js";
import { Loader } from "../../components/Loader";

export const SubCategoriaEdit = ({ subcategoria, reloadData }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState(subcategoria.titulo);
    const [categoria, setCategoria] = useState("");

    const getCategorias = async () => {
        const response = await listaCategoriasSelect("", 0, navigate);

        if (response.status === 200) {
            setCategorias(response.data.categorias);
        }

        setLoading(false);
    };

    const [categorias, setCategorias]: [any, any] = useState(getCategorias);

    const handleEdit = async () => {
        try {
            if (titulo === "") {
                notify("Insira um título", "error");
                return;
            }

            const response = await editaSubcategoria(subcategoria.id, { categoria, titulo }, navigate);

            if (response.status === 200) {
                reloadData();
                notify("Subcategoria editada com sucesso", "success");
                onClose();
            } else {
                notify("Erro ao editar Subcategoria", "error");
            }
        } catch {
            notify("Erro ao editar subcategoria", "error");
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!loading && !categorias.length) return <h1>VAZIO</h1>;

    return (
        <>
            <Tooltip label="Editar subcategoria">
                <IconButton size="sm" aria-label="deletar subcategoria" icon={<FiEdit />} onClick={onOpen} />
            </Tooltip>

            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>
                        Editar Subcategoria
                        <ModalCloseButton />
                    </ModalHeader>
                    {loading ? (
                        <Loader />
                    ) : (
                        <ModalBody>
                            <FormLabel>Categoria</FormLabel>
                            <Select
                                size="sm"
                                bg={colors.bg}
                                marginBottom={5}
                                onChange={(event) => setCategoria(event.target.value)}
                            >
                                {categorias.map((categoria) => {
                                    return (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.titulo}
                                        </option>
                                    );
                                })}
                            </Select>

                            <FormControl>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    size="sm"
                                    type="text"
                                    placeholder="Título"
                                    value={titulo}
                                    onChange={(event) => setTitulo(event.target.value)}
                                />
                            </FormControl>
                        </ModalBody>
                    )}
                    ;
                    <ModalFooter>
                        <Button size="sm" colorScheme={"linkedin"} onClick={handleEdit}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

