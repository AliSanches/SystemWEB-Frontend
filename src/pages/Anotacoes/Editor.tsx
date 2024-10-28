import { useEffect, useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Select,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../components/notify"; // Import Sun Editor's CSS File
import { getAnotacao, listaCategoriasSelect, updateAnotacao } from "./api";
import { listaSubcategorias, getSubcategoriaPorCategoria } from "./api.js";

export const Editor = (props) => {
    const colors = useDarkMode((state) => state.colors);
    const { idAnotacao } = useParams();
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [categoria, setCategoria] = useState<any>(null);
    const [subcategoria, setSubcategoria] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getData = async () => {
        setLoading(true);

        try {
            let response = await getAnotacao(idAnotacao, navigate);

            if (response.status === 200) {
                setTexto(response.data.texto);
                setTitulo(response.data.titulo);
                setCategoria(response.data.categoriaId);
                setLoading(false);
            }
        } catch {
            notify("Erro", "error");
        }
    };

    const saveData = async () => {
        setLoading(true);

        const categoriaNumber = Number(categoria);
        const subcategoriaNumber = Number(subcategoria);

        try {
            let response = await updateAnotacao(
                { texto, categoria: categoriaNumber, titulo, subcategoria: subcategoriaNumber },
                idAnotacao,
                navigate
            );
            if (response.status === 200) {
                getData();
                notify("Anotação salva", "success");
                navigate(`/app/anotacoes/visualizar/${idAnotacao}`);
            } else {
                setLoading(false);
                notify("Erro", "error");
            }
        } catch {
            setLoading(false);
            notify("Erro", "error");
        }
    };

    const getCategorias = async () => {
        const response = await listaCategoriasSelect("", 0, navigate);

        if (response.status === 200) {
            setCategorias(response.data.categorias);
        }

        setLoading(false);
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

        if (response.status === 200) {
            setSubcategorias(response.data.anotacoes_subcategoria);
            setSubcategoria(response.data.anotacoes_subcategoria[0].id);
        }

        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setLoading(true);

        if (categoria !== null) {
            ListarSuncategoriasPorCategoria(categoria);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [categoria]);

    if (!loading && !categorias.length) return <></>;

    if (categoria === null) {
        return <div>Loading...</div>;
    }

    if (!loading && subcategorias.length >= 1 && categorias)
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

                {!loading && texto && (
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
                                value={categoria}
                            >
                                {categorias.map((categoria) => {
                                    return (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.titulo}
                                        </option>
                                    );
                                })}
                            </Select>
                            <FormLabel mt={3}>Subcategoria</FormLabel>
                            <Select size="sm" bg={colors.bg} onChange={(event) => setSubcategoria(event.target.value)}>
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
                        />
                        <Button size="sm" ml={"auto"} colorScheme={"linkedin"} onClick={saveData}>
                            Salvar
                        </Button>
                    </VStack>
                )}
                {loading && (
                    <HStack width={"100%"} justifyContent={"center"}>
                        <Spinner color={colors.default} size={"lg"} />
                    </HStack>
                )}
            </VStack>
        );
};

