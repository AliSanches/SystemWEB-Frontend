import { VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Spinner } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import useDarkMode from "../../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { listCustomers } from "./api";
import { Search } from "./Search";
import { CustomerCard } from "./CustomerCard";
import useUserStore from "../../../stores/user";
import { AccessDenied } from "../../../components/AccessDenied";

export default function Customers(): JSX.Element {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [listNumber, setNumber] = useState(5);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    const loadData = useCallback(async () => {
        const response = await listCustomers(listNumber, search, navigate);

        if (response.status === 200) {
            setCount(response.data.count);
            setCustomers(response.data.data);
            setLoading(false);
        }
    }, [listNumber, search, navigate]);

    const loadMore = async () => {
        if (count - customers.length > 0) {
            setLoadingMore(true);
            const number = listNumber + 5;
            const response = await listCustomers(number, search, navigate);

            if (response.status === 200) {
                setCustomers(response.data.anotacoes);
                setNumber(number);
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return permissions.clientes >= 1 ? (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Clientes</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <VStack>
                <Flex justifyContent="space-between" width="100%" marginTop="10px" marginBottom="10px">
                    <Search search={search} setSearch={setSearch} setNumber={setNumber} loadData={loadData} />
                    {permissions.clientes === 2 ? (
                        <Button
                            size="sm"
                            marginLeft="auto"
                            colorScheme={"linkedin"}
                            onClick={() => navigate("cadastro")}
                        >
                            Cadastrar
                        </Button>
                    ) : null}
                </Flex>
                {loading ? (
                    <Flex>
                        <Spinner color={colors.default} size="lg" />
                    </Flex>
                ) : (
                    <>
                        {customers.map((customer) => {
                            return <CustomerCard key={Math.random()} customer={customer} />;
                        })}
                        {loadingMore ? (
                            <Spinner color={colors.default} alignSelf="center" size="lg" />
                        ) : (
                            <>
                                <Text whiteSpace="nowrap">
                                    {customers.length > 0 ? "1" : "0"} a {customers.length} de {count}
                                </Text>
                                <Button
                                    size="sm"
                                    colorScheme={"linkedin"}
                                    width="fit-content"
                                    alignSelf="center"
                                    onClick={loadMore}
                                >
                                    {count - customers.length < 5 && count - customers.length > 0
                                        ? `Carregar +${count - customers.length}`
                                        : count - customers.length == 0
                                        ? "Nada a carregar"
                                        : "Carregar +5"}
                                </Button>
                            </>
                        )}
                    </>
                )}
            </VStack>
        </VStack>
    ) : (
        <AccessDenied />
    );
}

