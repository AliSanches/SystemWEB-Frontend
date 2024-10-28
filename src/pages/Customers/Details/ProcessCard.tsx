import { useNavigate } from "react-router-dom";
import useDarkMode from "../../../stores/useDarkMode";
import { HStack, VStack, Text, Tag, Button } from "@chakra-ui/react";
import { FcTimeline } from "react-icons/fc";
import ConfirmDeletion from "../../../components/ConfirmDeletionModal";
import { deleteProcess } from "./api";
import { notify } from "../../../components/notify";

export const ProcessCard = ({ process, reloadData }) => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const handleDeletion = async () => {
        try {
            const request = await deleteProcess(process.id, navigate);

            if (request.status === 200) {
                notify("Processo deletado", "success");
                reloadData();
            } else notify("Erro", "error");
        } catch {
            notify("Erro", "error");
        }
    };

    return (
        <HStack w="100%" borderRadius="5px" bg={colors.bg} padding="10px" justifyContent="space-between">
            <VStack alignItems="left" rowGap="0" w="25%">
                <Text fontSize="md">{process.name}</Text>
            </VStack>
            <HStack w="50%" bg="transparent">
                <Tag colorScheme={process.active ? "blue" : "red"}>{process.active ? "Em andamento" : "Encerrado"}</Tag>
                <Tag colorScheme="blue">{process.service.name}</Tag>
            </HStack>

            {process.active ? null : <ConfirmDeletion entity="processo" text="" handleDeletion={handleDeletion} />}
            <Button size="sm" columnGap={2} onClick={() => navigate(`/app/processos/${process.id}`)}>
                <FcTimeline />
                Acompanhar
            </Button>
        </HStack>
    );
};

