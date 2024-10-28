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
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { notify } from "../../../../components/notify";
import { Loader } from "../../../../components/Loader";
import { BsPerson } from "react-icons/bs";
import { getPontos, getTransicaoEspecial } from "../api.js";

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";
const amarelo = "rgb(240,180,70)";

export const AposentadoriaEspecial = () => {
    const [loading, setLoading] = useState(true);
    const colors = useDarkMode((state) => state.colors);
    const { customerId } = useParams();
    const navitate = useNavigate();

    const carregar = async () => {
        try {
            const query = await getTransicaoEspecial(customerId, navitate);

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
                Aposentadoria Especial (Transição - Pontos)
            </Text>
            <HStack flexWrap={"wrap"}>
                <StatsCard
                    bg={amarelo}
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
                    bg={amarelo}
                    title={"Tempo de Contribuição Total"}
                    stat={`${dados.contribuicao.anos} anos / ${dados.contribuicao.meses} meses / ${dados.contribuicao.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={dados.atividadeEspecial.isOk ? bgOk : bgNotOk}
                    title={"Tempo de Atividade Especial"}
                    stat={`${dados.atividadeEspecial.anos} anos / ${dados.atividadeEspecial.meses} meses / ${dados.atividadeEspecial.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={amarelo}
                    title={"Tempo de Atividade Não Especial"}
                    stat={`${dados.atividadeEspecial.anos} anos / ${dados.atividadeEspecial.meses} meses / ${dados.atividadeEspecial.dias} dias`}
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
                                25 anos de atividade especial + 86 pontos, em caso de risco baixo <br />
                                20 anos de atividade especial + 76 pontos, em caso de risco médio, ou <br />
                                15 anos de atividade especial + 66 pontos, em caso de risco alto.
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
                                A reforma da previdência acrescentou um requisito mínimo de pontos além do tempo de
                                atividade especial para concessão da aposentadoria. <br />
                                Este mínimo de pontos é a soma da idade com o tempo de atividade especial do
                                trabalhador.
                                <br /> Ou seja, se o trabalhador tem 50 anos de idade e 20 anos de atividade especial,
                                ele tem 70 pontos no total (50 + 20)
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

