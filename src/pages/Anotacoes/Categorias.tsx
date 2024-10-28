import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    HStack,
    Spinner,
    Text,
    VStack,
    Box,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";
import { CategoriaCard } from "./CategoriaCard";
import { listaCategorias } from "./api";
import { Outlet, useNavigate } from "react-router-dom";
import useDarkMode from "../../stores/useDarkMode";
import { CategoriaSearch } from "./CategoriaSearh";
import { AccessDenied } from "../../components/AccessDenied";
import useUserStore from "../../stores/user";

export const Categorias = () => {
    const [loading, setLoading] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [categorias, setCategorias]: [categorias: any, setCategorias: React.Dispatch<React.SetStateAction<any[]>>] =
        React.useState([]);
    const [skip, setSkip] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [search, setSearch] = React.useState("");
    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);
    const permissions = useUserStore((state) => state.permissions);

    const loadData = async () => {
        setLoading(true);
        return listaCategorias(search, skip, navigate);
    };

    const reloadData = async () => {
        setSkip(0);
        setLoading(true);
        const response = await listaCategorias(search, 0, navigate);

        setCategorias(response.data.categorias);
        setCount(response.data.count);
        setLoading(false);
    };

    const loadMore = async () => {
        if (count - categorias.length > 0) {
            setLoadingMore(true);
            const response = await listaCategorias(search, skip, navigate);

            let copyData = [...categorias];

            if (response.status === 200) {
                response.data.categorias.map((categoria) => {
                    if (!copyData.find((item) => item.id === categoria.id)) {
                        copyData.push(categoria);
                    }
                });
                setCategorias([...copyData]);
                setCount(response.data.count);
                setSkip(skip + 5);
                setLoadingMore(false);
            }
        }
    };

    React.useEffect(() => {
        let ignore = false;

        loadData().then((response) => {
            if (!ignore && response.status === 200) {
                setCategorias(response.data.categorias);
                setCount(response.data.count);
                setSkip(skip + 5);
                setLoading(false);
            }
        });

        return () => {
            ignore = true;
        };
    }, [search]);

    return permissions.anotacoes >= 1 ? (
        <VStack width={"100%"} alignItems={"left"}>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/anotacoes">Anotações</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#/app/anotacoes/categorias">Categorias</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <HStack mt={3} mb={3} width={"100%"} justifyContent={"space-between"}>
                <CategoriaSearch setSkip={setSkip} search={search} setSearch={setSearch} />
                <Box>
                    {permissions.anotacoes === 2 && (
                        <Button
                            marginRight={5}
                            size="sm"
                            colorScheme={"linkedin"}
                            onClick={() => navigate("/app/anotacoes/categorias/subcategoria/cadastro")}
                        >
                            Nova Subcategoria
                        </Button>
                    )}
                    {permissions.anotacoes === 2 && (
                        <Button
                            size="sm"
                            colorScheme={"linkedin"}
                            onClick={() => navigate("/app/anotacoes/categorias/cadastro")}
                        >
                            Nova Categoria
                        </Button>
                    )}
                </Box>
                //modal criacao
                <Outlet context={reloadData} />
            </HStack>

            {loading && (
                <HStack justifyContent={"center"}>
                    <Spinner alignSelf={"center"} color={colors.default} size={"lg"} />
                </HStack>
            )}
            {/* EXIBE CARD CATEGORIA */}
            {!loading &&
                categorias.map((categoria) => {
                    return <CategoriaCard key={Math.random()} categoria={categoria} reloadData={reloadData} />;
                })}

            {loadingMore && <Spinner color={colors.default} alignSelf="center" size="lg" />}
            {!loadingMore && !loading && (
                <>
                    <Text whiteSpace="nowrap" alignSelf={"center"}>
                        Exibindo {categorias.length > 0 ? "1" : "0"} a {categorias.length} de {count}
                    </Text>
                    <Button
                        size="sm"
                        colorScheme={"linkedin"}
                        width="fit-content"
                        alignSelf="center"
                        onClick={loadMore}
                    >
                        {count - categorias.length < 5 && count - categorias.length > 0
                            ? `Carregar +${count - categorias.length}`
                            : count - categorias.length == 0
                            ? "Nada a carregar"
                            : "Carregar +5"}
                    </Button>
                </>
            )}
        </VStack>
    ) : (
        <AccessDenied />
    );
};

