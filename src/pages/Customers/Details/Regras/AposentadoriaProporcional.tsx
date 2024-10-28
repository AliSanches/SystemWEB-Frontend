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
import { getPedagio } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../../../components/Loader";
import { CiCalendar } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";
const amarelo = "rgb(240,180,70)";

export const AposentadoriaProporcional = () => {
    const [loading, setLoading] = useState(true);

    const colors = useDarkMode((state) => state.colors);
    const { customerId } = useParams();
    const navigate = useNavigate();

    const load = async () => {
        let request = await getPedagio(customerId, navigate);

        if (request.status === 200) {
            setData(request.data);
            setLoading(false);
        }
    };

    const [data, setData]: [data: any, setData: any] = useState(() => load());

    if (loading) return <Loader />;
    if (!data)
        return (
            <Flex w="100%" justifyContent="center">
                <Text>Sem dados a exibir</Text>
            </Flex>
        );

    const trabalhadoAte98: any[] = [];
    const trabalhadoAte19: any[] = [];
    const tempoFaltante: any[] = [];
    const pedagio: any[] = [];
    const totalNecessario: any[] = [];
    const idadeEm19: any[] = [];

    for (let item in data.trabalhadoAte98) {
        trabalhadoAte98.push(<td key={Math.random()}>{data.trabalhadoAte98[item]}</td>);
    }

    for (let item in data.trabalhadoAte19) {
        trabalhadoAte19.push(<td key={Math.random()}>{data.trabalhadoAte19[item]}</td>);
    }

    for (let item in data.faltante) {
        tempoFaltante.push(<td key={Math.random()}>{data.faltante[item]}</td>);
    }

    for (let item in data.pedagio) {
        pedagio.push(<td key={Math.random()}>{data.pedagio[item]}</td>);
    }

    for (let item in data.totalNecessario) {
        totalNecessario.push(<td key={Math.random()}>{data.totalNecessario[item]}</td>);
    }

    for (let item in data.idadeEm19) {
        idadeEm19.push(<td key={Math.random()}>{data.idadeEm19[item]}</td>);
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
                Aposentadoria Proporcional (Pedágio)
            </Text>
            <HStack flexWrap="wrap" justifyContent={"center"}>
                <StatsCard
                    bg={data.idadeEm19.isOk ? bgOk : bgNotOk}
                    title={"Idade"}
                    stat={`${data.idadeEm19.anos} anos / ${data.idadeEm19.meses} meses / ${data.idadeEm19.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={data.trabalhadoAte98.isOk ? bgOk : bgNotOk}
                    title={"Contribuição até a reforma de 1998"}
                    stat={`${data.trabalhadoAte98.anos} anos / ${data.trabalhadoAte98.meses} meses / ${data.trabalhadoAte98.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Contribuição até a reforma de 2019"}
                    stat={`${data.trabalhadoAte19.anos} anos / ${data.trabalhadoAte19.meses} meses / ${data.trabalhadoAte19.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Contribuição faltante em 15/12/1998"}
                    stat={`${data.faltante.anos} anos / ${data.faltante.meses} meses / ${data.faltante.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Pedágio"}
                    stat={`${data.pedagio.anos} anos / ${data.pedagio.meses} meses / ${data.pedagio.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Contribuição faltante + pedágio"}
                    stat={`${data.totalNecessario.anos} anos / ${data.totalNecessario.meses} meses / ${data.totalNecessario.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Fator previdenciário"}
                    stat={`${data.fatorPrevidenciario}`}
                    icon={<CiCalendar size={"3em"} />}
                />
                <StatsCard
                    bg={data.carencias.isOk ? bgOk : bgNotOk}
                    title={"Meses de carência"}
                    stat={`${data.carencias.valor}`}
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
                                53 anos de idade para homem
                                <br />
                                48 anos de idade para mulher
                                <br />
                                30 anos de contribuição acrescido de um pedágio de 40%, se homem
                                <br />
                                25 anos de contribuição acrescido de um pedágio de 40%, se mulher
                                <br />
                                Carência de 180 meses
                                <br />
                                Ter começado a contribuir antes de 16/12/1998
                                <br />
                                Ter cumprido os requisitos acima antes de 13/11/2019
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
                                Até 1998, antes da sua extinção, o homem precisava de 30 anos de contribuição e a mulher
                                de 25 anos para ter direito à aposentadoria proporcional.
                                <br /> Ao extingui-la, a reforma da previdência criou um requisito adicional do pedágio
                                de 40% para aqueles trabalhadores que haviam começado a contribuir antes de 16/12/1998.
                                <br />
                                Este “pedágio” é um tempo adicional que o contribuinte vai precisar cumprir para ter
                                direito à aposentadoria proporcional. Dessa forma, quanto menos tempo faltava para o
                                contribuinte cumprir os requisitos da aposentadoria proporcional antes de 16/12/1998,
                                menor será o seu pedágio.
                                <br /> Por outro lado, para aqueles contribuintes que tinham pouco tempo de contribuição
                                antes de 16/12/1998, é praticamente impossível cumprir os requisitos da aposentadoria
                                proporcional antes de cumprir os requisitos da aposentadoria integral.
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
                            <th>MÊS</th>
                            <th>DIA</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>TRABALHADO ATÉ 15/12/1998</td>
                            {trabalhadoAte98}
                        </tr>
                        <tr>
                            <td>TEMPO FALTANTE EM 15/12/1998</td>
                            {tempoFaltante}
                        </tr>
                        <tr>
                            <td>PEDÁGIO</td>
                            {pedagio}
                        </tr>
                        <tr>
                            <td>TEMPO NECESSÁRIO</td>
                            {totalNecessario}
                        </tr>
                        <tr>
                            <td>TRABALHADO ATÉ 13/11/2019</td>
                            {trabalhadoAte19}
                        </tr>
                        <tr>
                            <td>IDADE EM 13/11/2019</td>
                            {idadeEm19}
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

