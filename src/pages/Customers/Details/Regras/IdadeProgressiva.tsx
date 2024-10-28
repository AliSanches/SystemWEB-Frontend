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

const bgOk = "rgb(20,140,40)";
const bgNotOk = "rgb(200,20,40)";

export const IdadeProgressiva = () => {
    const [loading, setLoading] = useState(true);
    const colors = useDarkMode((state) => state.colors);
    const { customerId } = useParams();
    const navitate = useNavigate();

    const carregar = async () => {
        try {
            const query = await getIdadeProgressiva(customerId, navitate);

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
                Idade Mínima Progressiva
            </Text>
            <HStack flexWrap={"wrap"} justifyContent={"center"}>
                <StatsCard
                    bg={dados.idade.isOk ? bgOk : bgNotOk}
                    title={"Idade"}
                    stat={`${dados.idade.anos} anos / ${dados.idade.meses} meses / ${dados.idade.dias} dias`}
                    icon={<BsPerson size={"3em"} />}
                />
                <StatsCard
                    bg={dados.contribuidoAte2019.isOk ? bgOk : bgNotOk}
                    title={"Contribuição antes da reforma"}
                    stat={`${dados.contribuidoAte2019.anos} anos / ${dados.contribuidoAte2019.meses} meses / ${dados.contribuidoAte2019.dias} dias`}
                    icon={<CiCalendarDate size={"3em"} />}
                />
                <StatsCard
                    bg={dados.contribuicaoTotal.isOk ? bgOk : bgNotOk}
                    title={"Contribuição total"}
                    stat={`${dados.contribuicaoTotal.anos} anos / ${dados.contribuicaoTotal.meses} meses / ${dados.contribuicaoTotal.dias} dias`}
                    icon={<CiCalendar size={"3em"} />}
                />
                <StatsCard
                    bg={dados.carencias.isOk ? bgOk : bgNotOk}
                    title={"Meses de carência"}
                    stat={`${dados.carencias.valor}`}
                    icon={<CiCalendar size={"3em"} />}
                />
                <StatsCard
                    bg="rgb(240,180,70)"
                    title={"Fator previdenciário"}
                    stat={`${dados.fatorPrevidenciario}`}
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
                                180 meses de carência
                                <br />
                                Ter contribuído antes da reforma de 2019
                                <br />
                                Idade mínima progressiva conforme tabela abaixo
                                <br />
                            </Text>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Text flex="1" fontWeight={"bold"} textAlign="left">
                            Tabela de idade
                        </Text>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel display={"flex"} justifyContent="center">
                        <Image src="https://www.jornalcontabil.com.br/wp-content/uploads/2020/12/transicao-idade-progressiva.png" />
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
                                A regra da idade progressiva é uma das regras de transição criadas pela reforma da
                                previdência para a aposentadoria por tempo de contribuição. Antes da reforma da
                                previdência, para se aposentar por tempo de contribuição, o contribuinte precisava
                                atingir um tempo mínimo de contribuição independentemente da idade. <br />
                                Infelizmente, a reforma da previdência criou uma “regra geral” que passou a exigir uma
                                idade mínima de 65 anos para a aposentadoria dos homens e de 62 anos para a
                                aposentadoria das mulheres.
                                <br /> Dessa forma, acabou com a aposentadoria por tempo de contribuição para aqueles
                                contribuintes que começaram a contribuir depois da reforma da previdência (13/11/2019).
                                <br />
                                Para se aposentar com base na regra de transição da idade progressiva, o contribuinte
                                precisa cumprir um requisito de tempo mínimo de contribuição, um requisito de idade
                                mínima (progressiva) e um requisito de carência.
                                <br />
                                Antes da reforma da previdência, para se aposentar por tempo de contribuição, o homem
                                precisava cumprir 35 anos de contribuição e a mulher 30 anos de contribuição. Além
                                disso, precisavam cumprir pelo menos 180 meses de carência. Tais requisitos foram
                                mantidos na regra de transição da idade progressiva. Porém, foi acrescido um requisito
                                adicional: o requisito da idade mínima progressiva.
                                <br />
                                Como a idade mínima para aposentadoria de homens e mulheres é diferente, esse requisito
                                da idade mínima progressiva também vai ser diferente conforme o gênero do contribuinte
                                ou da contribuinte.
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

