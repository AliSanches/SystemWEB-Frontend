import {
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { criaSubcategoria } from "./api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { notify } from "../../components/notify";
import { listaCategoriasSelect } from "./api.js";
import useDarkMode from "../../stores/useDarkMode";
import { Loader } from "../../components/Loader";

export const SubCategoriaCreate = () => {
    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("");
    const colors = useDarkMode((state) => state.colors);
    const reloadData = useOutletContext() as Function;
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getCategorias = async () => {
        const response = await listaCategoriasSelect("", 0, navigate);

        if (response.status === 200) {
            setCategorias(response.data.categorias);
            if (response.data.categorias.length > 0) setCategoria(response.data.categorias[0].id);

            setLoading(false);
        }
    };

    const [categorias, setCategorias]: [any, any] = useState(getCategorias);

    const handleClose = () => {
        navigate("/app/anotacoes/categorias");
    };

    const handleSave = async () => {
        try {
            if (titulo === "") {
                notify("Insira um título", "error");
                return;
            }

            const response = await criaSubcategoria({ categoria, titulo }, navigate);

            if (response.status === 201) {
                reloadData();
                notify("Subcategoria criada com sucesso", "success");
                handleClose();
            } else {
                notify("Erro ao criar subcategoria", "error");
            }
        } catch {
            notify("Erro ao criar subcategoria", "error");
        }
    };

    if (!loading && !categorias.length) return <AvisoCriarCategoria />;

    return (
        <Modal isOpen={true} onClose={handleClose} isCentered size="sm">
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>
                    Cadastrar Subcategoria
                    <ModalCloseButton />
                </ModalHeader>

                {loading ? (
                    <Loader />
                ) : (
                    <ModalBody>
                        <FormControl>
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

                <ModalFooter>
                    <Button size="sm" colorScheme={"linkedin"} onClick={handleSave}>
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const AvisoCriarCategoria = () => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    return (
        <Modal isOpen={true} onClose={() => {}} isCentered>
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>Aviso</ModalHeader>
                <ModalBody>
                    <Text>Para criar uma subcategoria é preciso primeiramente criar uma categoria</Text>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" mr="auto" onClick={() => navigate("/app/anotacoes/categorias")}>
                        Voltar
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="linkedin"
                        onClick={() => navigate("/app/anotacoes/categorias/cadastro")}
                    >
                        Criar categoria
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

