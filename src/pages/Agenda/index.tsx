import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack, Text, VStack } from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { listarPorData } from "./api";
import { useNavigate } from "react-router-dom";
import { ModalNovaTarefa } from "./ModalNovaTarefa";
import { Tarefa } from "./TarefaCard";
import { TTarefa } from "./Types";
import { Loader } from "../../components/Loader";

export const Agenda = () => {
    const [loading, setLoading]: [boolean, any] = useState(true);
    const [data, setData]: [Date, any] = useState(new Date());

    const navigate = useNavigate();

    const carregaTarefas = async () => {
        setLoading(true);
        let query = await listarPorData(navigate, data.toISOString().split("T")[0]);
        setTarefas(query.data);
        setLoading(false);
    };

    useEffect(() => {
        carregaTarefas();
    }, [data]);

    const [tarefas, setTarefas]: [any, any] = useState(carregaTarefas);

    return (
        <VStack alignItems="left">
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Agenda</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <ModalNovaTarefa reload={carregaTarefas} />
            <HStack alignItems="top">
                <Box>
                    <Calendar locale="pt-BR" value={data} onChange={(event) => setData(event)} />
                </Box>

                {loading ? (
                    <Loader />
                ) : (
                    <VStack w="100%">
                        {tarefas.length ? (
                            tarefas.map((tarefa: TTarefa) => (
                                <Tarefa tarefa={tarefa} key={Math.random()} reload={carregaTarefas} />
                            ))
                        ) : (
                            <Text>Nenhuma tarefa na data selecionada</Text>
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

