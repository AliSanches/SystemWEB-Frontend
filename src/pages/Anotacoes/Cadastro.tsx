import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify"; // Import Sun Editor's CSS File
import { criaAnotacao, listaCategoriasSelect, getSubcategoriaPorCategoria, listaSubcategorias } from "./api";
import { Loader } from "../../components/Loader";
import "suneditor/dist/css/suneditor.min.css";

export const Cadastro = () => {
    const colors = useDarkMode((state) => state.colors);
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("<p></p>");
    const [categoria, setCategoria] = useState("");
    const [subcategoria, setSubcategoria] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const saveData = async () => {
        try {
            if (titulo === "") {
                notify("Insira um titulo!", "error");
            }

            let response = await criaAnotacao({ texto, titulo, categoria, subcategoria }, navigate);
            if (response.status === 200) {
                notify("Anotação criada com sucesso", "success");
                navigate(`/app/anotacoes/visualizar/${response.data.id}`);
            } else {
                setLoading(false);
                notify("Erro ao salvar anotação", "error");
            }
        } catch {
            setLoading(false);
            notify("Erro ao salvar anotação", "error");
        }
    };

    const getCategorias = async () => {
        const response = await listaCategoriasSelect("", 0, navigate);

        if (response.status === 200) {
            setCategorias(response.data.categorias);
            if (response.data.categorias.length > 0) setCategoria(response.data.categorias[0].id);

            setLoading(false);
        }
    };

    const [categorias, setCategorias]: [any, any] = useState(getCategorias);

    const getSubcategorias = async () => {
        const response = await listaSubcategorias(navigate);

        if (response.status === 200) {
            setSubcategorias(response.data);

            setLoading(false);
        }
    };
    const [subcategorias, setSubcategorias]: [any, any] = useState(getSubcategorias);

    const ListarSuncategoriasPorCategoria = async (id) => {
        const response = await getSubcategoriaPorCategoria(id, navigate);

        setLoading(true);

        if (response.status === 200) {
            setSubcategorias(response.data.anotacoes_subcategoria);
            setSubcategoria(response.data.anotacoes_subcategoria[0].id);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (categoria) ListarSuncategoriasPorCategoria(categoria);
    }, [categoria]);

    if (!loading && !categorias.length) return <AvisoCriarCategoria />;

    if (!loading && subcategorias.length >= 1)
        return (
            <VStack alignItems={"left"} height={"fit-content"}>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Início</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink href="#/app/anotacoes">Anotações</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">Editor</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                {loading ? (
                    <Loader />
                ) : (
                    <React.Fragment>
                        <VStack>
                            <FormControl mt={3}>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    size="sm"
                                    bg={colors.bg}
                                    placeholder={"Título"}
                                    value={titulo}
                                    onChange={(event) => setTitulo(event.target.value)}
                                />
                                <FormLabel mt={3}>Categoria</FormLabel>
                                <Select
                                    size="sm"
                                    bg={colors.bg}
                                    onChange={(event) => setCategoria(event.target.value)}
                                    value={categoria ?? ""}
                                >
                                    {categorias.map((categoria) => {
                                        return (
                                            <option key={Math.random()} value={categoria.id}>
                                                {categoria.titulo}
                                            </option>
                                        );
                                    })}
                                </Select>
                                <FormLabel mt={3}>Subcategoria</FormLabel>
                                <Select
                                    size="sm"
                                    bg={colors.bg}
                                    value={subcategoria}
                                    onChange={(event) => setSubcategoria(event.target.value)}
                                >
                                    {subcategorias.map((subcategoria) => (
                                        <option key={subcategoria.id} value={subcategoria.id}>
                                            {subcategoria.titulo}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <SunEditor
                                setOptions={{
                                    buttonList: buttonList.complex,
                                }}
                                //lang={"pt_br"}
                                defaultValue={texto}
                                onChange={(data) => setTexto(data)}
                                height={"500px"}
                            />
                        </VStack>
                        <Button size="sm" ml={"auto"} colorScheme={"linkedin"} onClick={saveData}>
                            Salvar
                        </Button>
                    </React.Fragment>
                )}
            </VStack>
        );
};

const AvisoCriarCategoria = () => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    return (
        <VStack alignItems={"left"} height={"fit-content"}>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/anotacoes">Anotações</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Editor</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Modal isOpen={true} onClose={() => {}} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Aviso</ModalHeader>
                    <ModalBody>
                        <Text>Para criar uma anotação é preciso primeiramente criar uma categoria</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" mr="auto" onClick={() => navigate("/app/anotacoes")}>
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
        </VStack>
    );
};

