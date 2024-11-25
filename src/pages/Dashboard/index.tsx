import {
    Box,
    chakra,
    Flex,
    HStack,
    SimpleGrid,
    Skeleton,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { BsPerson } from "react-icons/bs";
import { FiUsers, FiFile } from "react-icons/fi";
import { useGetCustomer } from "../Customers/Details/Anexos/api.js";
import { VictoryPie } from "victory";
import axios from "axios";
import useUserStore from "@/stores/user.js";

interface StatsCardProps {
    title: string;
    stat: string;
    icon: ReactNode;
    bg: string;
}

function StatsCard(props: StatsCardProps) {
    const { title, stat, icon, bg } = props;
    return (
        <Stat
            px={{ base: 1, sm: 2, md: 4 }}
            py={"5"}
            shadow={"xl"}
            bg={bg}
            borderColor={"whitesmoke"}
            rounded={"lg"}
            color="white"
        >
            <Flex justifyContent={"space-between"}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={"medium"} fontSize={{ base: "14px", sm: "18px" }} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box color={"whitesmoke"} alignContent={"center"}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

const getDashboard = (token) =>
    axios
        .get(`${import.meta.env.VITE_API_URL}/relatorios/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.data);

export const Dashboard = () => {
    return (
        <Suspense>
            <DashboardData />
        </Suspense>
    );
};

const DashboardData = () => {
    const { token } = useUserStore((state) => state);
    const { data } = useSuspenseQuery({
        queryKey: ["get-dashboard"],
        queryFn: () => getDashboard(token),
        refetchInterval: 10000,
    });

    return (
        <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
            <chakra.h1 textAlign={"center"} fontSize={{ base: "22px", sm: "4xl" }} pb={10} fontWeight={"bold"}>
                RESUMO DO SISTEMA
            </chakra.h1>
            <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={{ base: 5, lg: 8 }}>
                <StatsCard
                    bg="#673bb7"
                    title={"Usuários em uso"}
                    stat={data.usuariosEmUso}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg="#d32f2e"
                    title={"Clientes cadastrados"}
                    stat={data.qtdClientes}
                    icon={<FiUsers size={"3em"} />}
                />
                <StatsCard
                    bg="#fdc102"
                    title={"Processos cadastrados"}
                    stat={data.qtdProcessos}
                    icon={<FiFile size={"3em"} />}
                />
                <VictoryPie
                    height={300}
                    innerRadius={80}
                    colorScale="cool"
                    data={[
                        { x: "Ativos", y: data.usuariosAtivos },
                        { x: "Inativos", y: data.usuariosInativos },
                    ]}
                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
                />

                <Skeleton isLoaded={data.clientesHomem + data.clientesMulher == 0 ? false : true}>
                    <VictoryPie
                        height={300}
                        innerRadius={80}
                        colorScale="red"
                        data={[
                            { x: "Homem", y: data.clientesHomem },
                            { x: "Mulher", y: data.clientesMulher },
                        ]}
                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                    />
                </Skeleton>

                <Skeleton isLoaded={data.processosEmAberto + data.processosFinalizados == 0 ? false : true}>
                    <VictoryPie
                        height={300}
                        innerRadius={80}
                        colorScale="warm"
                        data={[
                            { x: "Em aberto", y: data.processosEmAberto },
                            { x: "Finalizados", y: data.processosFinalizados },
                        ]}
                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                    />
                </Skeleton>
            </SimpleGrid>
            <VStack bg="white" shadow={"xl"} px={{ base: 2, md: 4 }} mt={10} py={"5"} rounded="lg">
                <chakra.h2 fontWeight="bold">Armazenamento</chakra.h2>
                <Armazenamento />
            </VStack>
        </Box>
    );
};

export const Armazenamento = () => {
    const customerId = "1";
    const { data } = useSuspenseQuery({
        queryKey: ["get-customer"],
        queryFn: () => useGetCustomer(customerId!),
    });

    return (
        <HStack w="100%">
            <Text fontSize="smaller" w="fit-content">
                Em uso: {data.porcentagemDeUso}% de {data.espacoContratado}MB
            </Text>
            <Box w="100%" h="10px" bg="lightgrey" borderRadius="5px">
                <Box
                    w={data.porcentagemDeUso <= 100 ? `${data.porcentagemDeUso}%` : "100%"}
                    bg={data.porcentagemDeUso > 75 ? "red" : "limegreen"}
                    h="10px"
                    borderRadius="5px"
                ></Box>
            </Box>
        </HStack>
    );
};

