import { Button, HStack, VStack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { listContratos } from "../../Contratos/api";
import { useState } from "react";
import useDarkMode from "../../../stores/useDarkMode";
import { Loader } from "../../../components/Loader";

export const Contratos = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        let data = await listContratos(navigate);
        data = data.data;

        setContratos(data);
        setLoading(false);
    };

    const [contratos, setContratos]: [any, any] = useState(fetchData);

    if (loading) return <Loader />;

    if (contratos.length == 0)
        return (
            <HStack justifyContent="center">
                <Text>Nenhum contrato cadastrado</Text>
            </HStack>
        );

    return (
        <VStack alignItems="flex-start">
            {contratos.map((contrato) => {
                return <ContratoCard key={Math.random()} titulo={contrato.titulo} idContrato={contrato.id} />;
            })}
        </VStack>
    );
};

const ContratoCard = ({ titulo, idContrato }) => {
    const colors = useDarkMode((state) => state.colors);
    const { customerId } = useParams();

    const geraContrato = () => {
        window.open(`${import.meta.env.VITE_API_URL}/contrato/${customerId}/${idContrato}`, "_blank");
    };

    return (
        <HStack w="100%" bg={colors.bg} borderRadius="5px" padding="10px">
            <p>{titulo}</p>
            <Button size="sm" ml={"auto"} onClick={geraContrato}>
                Emitir
            </Button>
        </HStack>
    );
};

