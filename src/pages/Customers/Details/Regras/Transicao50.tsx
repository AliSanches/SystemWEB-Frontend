import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    HStack,
    Spinner,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";
import useDarkMode from "../../../../stores/useDarkMode";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTransicao50 } from "../api";
import { Loader } from "../../../../components/Loader";
import { BsPerson } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";
const amarelo = "rgb(240,180,70)";

export const Transicao50 = () => {
    const [loading, setLoading] = useState(true);
    const { customerId } = useParams();
    const navigate = useNavigate();

    const load = async () => {
        let transicao50 = await getTransicao50(customerId, navigate);
        if (transicao50.status === 200) {
            setData(transicao50.data);
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
    let contribuidoAposLimite: any[] = [];
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

    for (let item in data.faltanteComPedagio) {
        faltanteComPedagio.push(<td key={Math.random()}>{data.faltanteComPedagio[item]}</td>);
    }

    for (let item in data.contribuidoAposLimite) {
        contribuidoAposLimite.push(<td key={Math.random()}>{data.contribuidoAposLimite[item]}</td>);
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
                Transição de 50%
            </Text>
            <HStack flexWrap="wrap" justifyContent={"center"}>
                <StatsCard
                    bg={amarelo}
                    title={"Idade"}
                    stat={`${data.idade.anos} anos / ${data.idade.meses} meses / ${data.idade.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={data.trabalhado.isOk ? bgOk : bgNotOk}
                    title={"Contribuição antes da reforma"}
                    stat={`${data.trabalhado.anosAteLimite} anos / ${data.trabalhado.mesesAteLimite} meses / ${data.trabalhado.diasAteLimite} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
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
                    bg={amarelo}
                    title={"Contribuição faltante + pedágio"}
                    stat={`${data.faltanteComPedagio.anos} anos / ${data.faltanteComPedagio.meses} meses / ${data.faltanteComPedagio.dias} dias`}
                    icon={<CiCalendar size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Fator previdenciário"}
                    stat={`${data.fatorPrevidenciario}`}
                    icon={<CiCalendar size={"3em"} />}
                />
            </HStack>
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
                                35 anos de contribuição para homem
                                <br />
                                30 anos de contribuição para mulher
                                <br />
                                33 anos de contribuição até 13/11/2019, se homem
                                <br />
                                30 anos de contribuição até 13/11/2019, se homem
                                <br />
                                50% de pedágio sobre o tempo que faltava para se aposentar no momento da vigência da
                                Reforma (13/11/2019)
                                <br />
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
                                Imagine que Paulo Roberto tivesse 34 anos de tempo de contribuição no dia 13/11/2019.
                                <br />
                                Como faltava apenas 1 ano para ele se aposentar na data em que a Reforma entrou em
                                vigor, Paulo Roberto poderá se enquadrar nesta Regra de Transição. Deste modo, para
                                cumprir os requisitos da aposentadoria, e por ainda não ter completado 35 anos (mas 34),
                                ele deverá recolher mais um ano de contribuições. <br />
                                Assim, Paulo Roberto pagará 50% deste 1 ano que faltava para ele completar os 35 anos da
                                Regra de Transição do Pedágio. <br />
                                50% de 1 ano = 6 meses de Pedágio. <br />
                                Na prática, o segurado Paulo terá que trabalhar por mais 1 ano e 6 meses para conseguir
                                se aposentar. Então, caso ele tenha continuado com um recolhimento ininterrupto desde o
                                dia 13/11/2019, certamente conseguiu se aposentar no ano passado, em maio de 2021.
                            </Text>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text flex="1" fontWeight={"bold"} textAlign="left">
                            Recomendação
                        </Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel display="flex" rowGap={2} flexDirection="column">
                        <Box>
                            <Text textAlign={"center"}>{data.observacao}</Text>
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
                            <td>TEMPO FALTANTE</td>
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
                            {contribuidoAposLimite}
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

