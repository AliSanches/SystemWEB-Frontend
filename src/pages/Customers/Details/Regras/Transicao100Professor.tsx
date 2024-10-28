import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    HStack,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";
import useDarkMode from "../../../../stores/useDarkMode";
import { ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../../../components/Loader";
import { BsPerson } from "react-icons/bs";
import { CiCalendarDate, CiCalendar } from "react-icons/ci";
import { getTransicao100Professor } from "../api.js";

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";
const amarelo = "rgb(240,180,70)";

export const Transicao100Professor = () => {
    const [loading, setLoading] = useState(true);
    const { customerId } = useParams();
    const navigate = useNavigate();

    const load = async () => {
        let transicao100 = await getTransicao100Professor(customerId, navigate);
        if (transicao100.status === 200) {
            setData(transicao100.data);
            setLoading(false);
        }
    };

    const [data, setData]: [data: any, setData: any] = useState(() => load());
    const colors = useDarkMode((state) => state.colors);

    if (loading) return <Loader />;
    if (!data)
        return (
            <Flex w="100%" justifyContent="center">
                <Text>Sem dados a exibir</Text>
            </Flex>
        );

    let idade: any[] = [];
    let trabalhado: any[] = [];
    let faltante: any[] = [];
    let pedagio: any[] = [];
    let faltanteComPedagio: any[] = [];
    let carencias: any[] = [];
    let contribuidoApos19: any[] = [];
    let total: any[] = [];

    for (let item in data.idade) {
        idade.push(<td key={Math.random()}>{data.idade[item]}</td>);
    }

    for (let item in data.trabalhado) {
        trabalhado.push(<td key={Math.random()}>{data.trabalhado[item]}</td>);
    }

    for (let item in data.faltante) {
        faltante.push(<td key={Math.random()}>{data.faltante[item]}</td>);
    }

    for (let item in data.total) {
        total.push(<td key={Math.random()}>{data.total[item]}</td>);
    }

    for (let item in data.pedagio) {
        pedagio.push(<td key={Math.random()}>{data.pedagio[item]}</td>);
    }

    for (let item in data.carencias) {
        carencias.push(<td key={Math.random()}>{data.carencias[item]}</td>);
    }

    for (let item in data.contribuidoApos19) {
        contribuidoApos19.push(<td key={Math.random()}>{data.contribuidoApos19[item]}</td>);
    }

    for (let item in data.faltanteComPedagio) {
        faltanteComPedagio.push(<td key={Math.random()}>{data.faltanteComPedagio[item]}</td>);
    }

    return (
        <VStack
            padding="20px"
            bg={colors.bg}
            borderRadius="10px"
            boxShadow={colors.darkModeOn ? "0 0px 5px 2px rgba(50,50,50,1)" : "0 0px 5px 2px rgba(150,150,150,0.2)"}
            justifyContent="center"
            rowGap="20px"
            minW="full"
        >
            <Text fontSize={"larger"} fontWeight={"500"}>
                Transição de 100% do Professor
            </Text>
            <HStack flexWrap="wrap" justifyContent={"center"}>
                <StatsCard
                    bg={data.idade.isOk ? bgOk : bgNotOk}
                    title={"Idade"}
                    stat={`${data.idade.anos} anos / ${data.idade.meses} meses / ${data.idade.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Contribuição antes da reforma"}
                    stat={`${data.trabalhado.anosContribAte19} anos / ${data.trabalhado.mesesContribAte19} meses / ${data.trabalhado.diasContribAte19} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg="rgb(240,180,70)"
                    title={"Contribuição após a reforma"}
                    stat={`${data.contribuidoApos19.anos} anos / ${data.contribuidoApos19.meses} meses / ${data.contribuidoApos19.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg="rgb(240,180,70)"
                    title={"Pedágio"}
                    stat={`${data.pedagio.anos} anos / ${data.pedagio.meses} meses / ${data.pedagio.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={data.carencias.isOk ? bgOk : bgNotOk}
                    title={"Meses de carência"}
                    stat={`${data.carencias.value}`}
                    icon={<CiCalendar size={"3em"} />}
                />
                <StatsCard
                    bg="rgb(240,180,70)"
                    title={"Contribuição faltante + pedágio"}
                    stat={`${data.faltanteComPedagio.anos} anos / ${data.faltanteComPedagio.meses} meses / ${data.faltanteComPedagio.dias} dias`}
                    icon={<CiCalendar size={"3em"} />}
                />
            </HStack>
            {false && (
                <Text mt={5} mb={5} color={colors.default} fontWeight="bold">
                    {data.observacao}
                </Text>
            )}
            <Accordion allowToggle defaultIndex={0} alignSelf={"flex-start"} w="100%">
                <AccordionItem>
                    <AccordionButton>
                        <Text flex="1" fontWeight={"bold"} textAlign="left">
                            Requisitos
                        </Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <VStack w="100%" p={3} border={"1px solid gray"} rounded="lg">
                            <Text textAlign={"center"}>
                                52 anos de idade para a professora, no momento da requisição
                                <br />
                                55 anos de idade para o professor, no momento da requisição
                                <br />
                                25 anos de contribuição para a professora
                                <br />
                                30 anos de contribuição para o professor
                                <br />
                                O dobro do tempo que faltava para se aposentar no momento da vigência da Reforma
                                (13/11/2019)
                                <br />
                                Para o professor, dos 30 anos, 25 precisam ter sido no serviço público, e mais 5 anos no
                                cargo em que a aposentadoria for concedida.
                                <br />
                                Para a professora, dos 25 anos, 20 precisam ter sido no serviço público, e mais 5 anos
                                no cargo em que a a aposentadoria for concedida.
                            </Text>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text flex="1" fontWeight={"bold"} textAlign="left">
                            Explicação
                        </Text>
                        <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel display="flex" rowGap={2} flexDirection="column">
                        <Box>
                            <Text textAlign={"center"}>
                                Professores da rede pública têm que somar 25 anos de serviço público, e mais 5 anos no
                                cargo em que a aposentadoria for concedida. <br />
                                Para professoras da rede pública, 20 anos de serviço público, e mais 5 anos no cargo em
                                que a aposentadoria for concedida.
                            </Text>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            {false && (
                <table style={{ borderSpacing: "20px", borderCollapse: "separate" }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ANO</th>
                            <th>MES</th>
                            <th>DIA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>IDADE DO BENEFICIÁRIO</td>
                            {idade}
                        </tr>
                        <tr>
                            <td>TRABALHADO ATÉ 13/11/2019</td>
                            {trabalhado}
                        </tr>
                        <tr>
                            <td>IDADE FALTANTE</td>
                            {faltante}
                        </tr>
                        <tr>
                            <td>PEDÁGIO</td>
                            {pedagio}
                        </tr>
                        <tr>
                            <td>TEMPO FALTANTE + PEDÁGIO</td>
                            {faltanteComPedagio}
                        </tr>
                        <tr>
                            <td>CONTRIBUÍDO APÓS 13/11/2019</td>
                            {contribuidoApos19}
                        </tr>
                        <tr>
                            <td>MESES DE CARÊNCIA</td>
                            <td>0</td>
                            <td>{data.carencias}</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </VStack>
    );
};

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
            minW="fit-content"
            maxW={"fit-content"}
            px={{ base: 2, md: 1 }}
            py={"2"}
            shadow={"xl"}
            bg={bg}
            borderColor={"whitesmoke"}
            rounded={"lg"}
            color="white"
        >
            <Flex justifyContent={"space-between"}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={"medium"} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box ml={3} my={"auto"} color={"whitesmoke"} alignContent={"center"}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

