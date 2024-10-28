import { FiAlertTriangle } from "react-icons/fi";
import { Text, VStack } from "@chakra-ui/react";

export const AccessDenied = () => {
    return (
        <VStack>
            <Text fontWeight={"500"} fontSize={"18px"}>
                Acesso restrito
            </Text>
            <FiAlertTriangle color={"orange"} size={"30px"} />
            <h1>Você não possui acesso ao recurso solicitado</h1>
        </VStack>
    );
};
