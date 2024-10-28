import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    HStack,
    Image,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";
import useDarkMode from "../../../../stores/useDarkMode";
import { getIdadeProgressiva } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { notify } from "../../../../components/notify";
import { Loader } from "../../../../components/Loader";
import { BsPerson } from "react-icons/bs";
import { CiCalendarDate, CiCalendar } from "react-icons/ci";
import { getPontos } from "../api.js";

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";

export const RegraPontos = () => {
    const [loading, setLoading] = useState(true);
    const colors = useDarkMode((state) => state.colors);
    const { customerId } = useParams();
    const navitate = useNavigate();

    const carregar = async () => {
        try {
            const query = await getPontos(customerId, navitate);

            setDados(query.data);
            setLoading(false);
        } catch {
            notify("Erro ao carregar dados", "error");
        }
    };

    const [dados, setDados]: [any, any] = useState(carregar);
    if (loading) return <Loader />;

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
                Regra dos Pontos
            </Text>
            <HStack flexWrap={"wrap"}>
                <StatsCard
                    bg={bgOk}
                    title={"Idade"}
                    stat={`${dados.idade.anos} anos / ${dados.idade.meses} meses / ${dados.idade.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={dados.pontos.isOk ? bgOk : bgNotOk}
                    title={"Pontos"}
                    stat={`${dados.pontos.value}`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={dados.contribuicao.isOk ? bgOk : bgNotOk}
                    title={"Tempo de Contribuição"}
                    stat={`${dados.contribuicao.anos} anos / ${dados.contribuicao.meses} meses / ${dados.contribuicao.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
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
                                Atingir a pontuação necessária conforme tabela abaixo
                            </Text>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text flex="1" fontWeight={"bold"} textAlign="left">
                            Tabela de pontuação
                        </Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel display={"flex"} justifyContent="center">
                        <Image src="https://www.mariliacampos.com.br/files/Tab1.PNG" />
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
                                Para se aposentar pela regra dos pontos é preciso ter contribuído no mínimo 30 anos no
                                caso das mulheres e os homens por 35 anos.
                                <br /> A pontuação aumenta um ponto todo ano.
                                <br /> Começou com 85 pontos para as mulheres e 95 pontos para os homens. No ano que vem
                                as mulheres precisam atingir 91 pontos e os homens 101 pontos. <br /> A regra de pontos
                                tem a previsão de acabar em 2028 (mulheres) e em 2033 (homens).
                            </Text>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
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

