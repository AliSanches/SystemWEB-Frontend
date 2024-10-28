import { Button, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { FcFinePrint } from "react-icons/fc";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import ConfirmDeletion from "../../components/ConfirmDeletionModal";
import { deletaAnotacao } from "./api";
import { notify } from "../../components/notify";
import useUserStore from "../../stores/user";

export const AnotacaoCard = ({ anotacao, reloadData }) => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const handleDeletion = async () => {
        try {
            const request = await deletaAnotacao(anotacao.id, navigate);

            if (request.status === 200) {
                notify("Anotação deletada", "success");
                reloadData();
            } else {
                notify("Erro", "error");
            }
        } catch {
            notify("Erro", "error");
        }
    };

    return (
        <HStack w="100%" borderRadius="5px" bg={colors.bg} padding="10px" justifyContent="space-between">
            <VStack alignItems="left" rowGap="0" w="40%">
                <Text fontSize="md">{anotacao.titulo}</Text>
            </VStack>
            <HStack w="25%" bg="transparent">
                <Tag colorScheme={"yellow"}>{anotacao.categoria.titulo}</Tag>
                <Tag colorScheme={"yellow"}>{anotacao.subcategoria.titulo}</Tag>
            </HStack>

            {permissions.anotacoes === 2 && (
                <ConfirmDeletion entity="Anotação" text="" handleDeletion={handleDeletion} />
            )}
            <Button size="sm" onClick={() => navigate(`visualizar/${anotacao.id}`)} columnGap={2}>
                <FcFinePrint />
                Visualizar
            </Button>
        </HStack>
    );
};

