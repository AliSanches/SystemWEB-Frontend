import { Loader } from "@/components/Loader.js";
import { VStack, HStack, Text, Box, Flex, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { CardPastaGed } from "./CardPastaGed.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPorcentagemUsoGed, getPastas } from "./api.js";
import { ModalCreatePasta } from "./ModalCreatePasta.js";
import { useState } from "react";
import { Search } from "./Search.js";

export const GED = () => {
    return (
        <VStack w="100%" alignItems="left">
            <Suspense fallback={<Loader />}>
                <Flex gap={5} w="100%" flexDirection="column" mb={8}>
                    <Armazenamento />
                </Flex>
                <Conteudo />
            </Suspense>
        </VStack>
    );
};

const Armazenamento = () => {
    const { data } = useSuspenseQuery({
        queryKey: ["get-gedArmazenamento"],
        queryFn: () => getPorcentagemUsoGed(),
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

const Conteudo = () => {
    const [search, setSearch] = useState("");

    const { data } = useSuspenseQuery({
        queryKey: ["get-data"],
        queryFn: () => getPastas(""),
    });

    const filteredPastas = search
        ? data.filter((pasta) => pasta.titulo.toLowerCase().includes(search.toLowerCase()))
        : data;

    if (data.length >= 1)
        return (
            <Suspense fallback={<Spinner></Spinner>}>
                <VStack w="100%" alignItems={"left"}>
                    <Flex>
                        <Search search={search} setSearch={setSearch} />
                        <ModalCreatePasta />
                    </Flex>
                    {filteredPastas.map((pasta) => {
                        return <CardPastaGed key={Math.random()} pasta={pasta} />;
                    })}
                </VStack>
            </Suspense>
        );
    return <h1>Nenhuma categoria cadastrada no momento</h1>;
};

