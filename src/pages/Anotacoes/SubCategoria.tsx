import { HStack, Tag, Text, VStack } from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";
import { SubCategoriaDelete } from "./SubCategoriaDelete.js";
import { SubCategoriaEdit } from "./SubCategoriaEdit.js";
import { listQtdAnotacaoPorSubcategoria } from "./api.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const SubCategoria = ({ subcategoria, reload }) => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [qtdAnotacoes, setQtdAnotacoes]: [any, any] = useState();

    const getQtdAnotacoes = async () => {
        setLoading(true);
        const response = await listQtdAnotacaoPorSubcategoria(subcategoria.id, navigate);

        setQtdAnotacoes(response.data.QtdAnotacoes);
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(getQtdAnotacoes, 1000);
    }, []);

    if (loading !== true)
        return (
            <>
                <VStack alignItems="left" rowGap="0" w="100%">
                    <HStack w="100%" borderRadius="5px" bg={colors.bg} padding="15px" mb={2}>
                        <VStack alignItems="left" rowGap="0" w="45%">
                            <Text fontSize="md">{subcategoria.titulo}</Text>
                        </VStack>
                        <HStack w="25%" bg="transparent" textAlign="left">
                            <Tag colorScheme={"blue"}>
                                {qtdAnotacoes.qtdAnotacao <= 1
                                    ? qtdAnotacoes.qtdAnotacao + " Anotação"
                                    : qtdAnotacoes.qtdAnotacao + " Anotações"}
                            </Tag>
                        </HStack>
                        <SubCategoriaDelete
                            id={subcategoria.id}
                            reloadData={reload}
                            qtdAnotacoes={qtdAnotacoes.qtdAnotacao}
                        />
                        <SubCategoriaEdit subcategoria={subcategoria} reloadData={reload} />
                    </HStack>
                </VStack>
            </>
        );
};

