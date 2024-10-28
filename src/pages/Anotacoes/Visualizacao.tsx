import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Container,
    HStack,
    Tag,
    Text,
    VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useDarkMode from "../../stores/useDarkMode";
import { getAnotacao } from "./api";
import { notify } from "../../components/notify";
import useUserStore from "../../stores/user";
import { AccessDenied } from "../../components/AccessDenied";
import { Loader } from "../../components/Loader";

export const WikiVisualizacao = () => {
    const { idAnotacao } = useParams();
    const [texto, setTexto]: [any, any] = useState(null);
    const [titulo, setTitulo] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await getAnotacao(idAnotacao, navigate);

            if (response.status === 200) {
                setTexto(response.data.texto);
                setTitulo(response.data.titulo);
                setCategoria(response.data.categoria.titulo);
                setLoading(false);
            }
        } catch {
            notify("erro", "error");
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const colors = useDarkMode((state) => state.colors);

    return permissions.anotacoes >= 1 ? (
        <VStack alignItems={"left"}>
            <Breadcrumb alignSelf={"left"} spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/anotacoes">Anotações</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">ID da anotação: {idAnotacao}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <HStack>
                        <Text fontWeight={"bold"}>{titulo}</Text>
                        <Tag colorScheme="yellow">{categoria}</Tag>
                        {permissions.anotacoes === 2 && (
                            <Button
                                size="sm"
                                colorScheme={"linkedin"}
                                ml={"auto"}
                                onClick={() => navigate(`/app/anotacoes/editor/${idAnotacao}`)}
                            >
                                Editar
                            </Button>
                        )}
                    </HStack>
                    <Container
                        bg={colors.bg}
                        padding={"20px"}
                        minWidth={"100%"}
                        minHeight="100%"
                        dangerouslySetInnerHTML={{ __html: texto }}
                    />
                </Fragment>
            )}
        </VStack>
    ) : (
        <AccessDenied />
    );
};

