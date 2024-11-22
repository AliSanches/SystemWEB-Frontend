import { Button, Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode.js";

export const RelatorioClientes = () => {
    const colors = useDarkMode((state) => state.colors);

    const geraRelatorio = () => {
        window.open(`${import.meta.env.VITE_API_URL}/relatorios/1`, "_blank");
    };

    return (
        <Card size="sm" bg={colors.bg} color={colors.text}>
            <CardHeader>
                <Text fontWeight="bold">Listagem de clientes</Text>
            </CardHeader>
            <CardBody>
                Emite uma listagem com todos os clientes cadastrados no sistema, contendo seu nome, gênero, e data de
                nascimento.
            </CardBody>
            <CardFooter>
                <Button ml="auto" size="sm" colorScheme="linkedin" onClick={geraRelatorio}>
                    Emitir
                </Button>
            </CardFooter>
        </Card>
    );
};

