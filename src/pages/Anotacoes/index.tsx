import React from "react";
import "suneditor/dist/css/suneditor.min.css";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Search } from "./Search.js";
import { AnotacaoCard } from "./AnotacaoCard.js";
import { useNavigate } from "react-router-dom";
import { FcList } from "react-icons/fc/index.js";
import { listaAnotacoes } from "./api.js";
import useDarkMode from "../../stores/useDarkMode.js";
import { notify } from "../../components/notify.js";
import useUserStore from "../../stores/user.js";
import { AccessDenied } from "../../components/AccessDenied.js";

export const Anotacoes = () => {
    const [search, setSearch] = React.useState("");
    const [data, setData]: [data: any[], setData: React.Dispatch<React.SetStateAction<any[]>>] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [count, setCount] = React.useState(0);
    const [skip, setSkip] = React.useState(0);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);
    const permissions = useUserStore((state) => state.permissions);

    const reloadData = async () => {
        setSkip(0);
        setLoading(true);
        try {
            const request = await listaAnotacoes(search, 0, navigate);
            setData(request.data.anotacoes);
            setCount(request.data.count);
            setLoading(false);
        } catch {
            notify("Erro", "error");
        }
    };

    const loadData = async () => {
        setLoading(true);
        return listaAnotacoes(search, skip, navigate);
    };

    React.useEffect(() => {
        let ignore = false;

        loadData().then((request) => {
            if (!ignore) {
                setData(request.data.anotacoes);
                setCount(request.data.count);
                setSkip(skip + 5);
                setLoading(false);
            }
        });

        return () => {
            ignore = true;
        };
    }, [search]);

    const loadMore = async () => {
        if (count - data.length > 0) {
            setLoadingMore(true);
            const response = await listaAnotacoes(search, skip, navigate);

            let copyData = [...data];

            if (response.status === 200) {
                response.data.anotacoes.map((anotacao) => {
                    if (!copyData.find((item) => item.id === anotacao.id)) {
                        copyData.push(anotacao);
                    }
                });
                setData([...copyData]);
                setCount(response.data.count);
                setSkip(skip + 5);
                setLoadingMore(false);
            }
        }
    };

    return permissions.anotacoes >= 1 ? (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Anotações</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <HStack mb={3} mt={3} display={{ base: "flex" }} flexDirection={{ base: "column", sm: "row" }}>
                <Search search={search} setSearch={setSearch} setSkip={setSkip} />
                <Button
                    size="sm"
                    ml={{ base: "0", sm: "auto" }}
                    mr={2}
                    columnGap={1}
                    onClick={() => navigate("categorias")}
                >
                    <FcList />
                    Categorias
                </Button>
                {permissions.anotacoes === 2 && (
                    <Button size="sm" colorScheme={"linkedin"} onClick={() => navigate("editor")} width="fit-content">
                        Nova Anotação
                    </Button>
                )}
            </HStack>
            {!loading &&
                data.map((anotacao) => {
                    return <AnotacaoCard key={Math.random()} anotacao={anotacao} reloadData={reloadData} />;
                })}
            {loading && (
                <HStack width={"100%"} justifyContent={"center"}>
                    <Spinner color={colors.default} size={"lg"} />
                </HStack>
            )}

            {loadingMore && <Spinner color={colors.default} alignSelf="center" size="lg" />}
            {!loadingMore && !loading && (
                <>
                    <Text whiteSpace="nowrap" alignSelf={"center"}>
                        Exibindo {data.length > 0 ? "1" : "0"} a {data.length} de {count}
                    </Text>
                    <Button
                        size="sm"
                        colorScheme={"linkedin"}
                        width="fit-content"
                        alignSelf="center"
                        onClick={loadMore}
                    >
                        {count - data.length < 5 && count - data.length > 0
                            ? `Carregar +${count - data.length}`
                            : count - data.length == 0
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

