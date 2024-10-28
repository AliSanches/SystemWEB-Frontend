import { Button, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteOne } from "./api";
import { notify } from "../../components/notify";
import ConfirmDeletion from "../../components/ConfirmDeletionModal";

export const ContratoCard = ({ titulo, id, reload }) => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const handleDeletion = async () => {
        let request = await deleteOne(id, navigate);

        if (request.status === 200) {
            notify("Contrato deletado!", "success");
            reload();
        }
    };

    return (
        <HStack w="100%" bg={colors.bg} borderRadius="5px" padding="10px">
            <p>{titulo}</p>
            <ConfirmDeletion entity="Contrato" handleDeletion={handleDeletion} text="" />

            <Tooltip label="Editar contrato">
                <IconButton
                    size="sm"
                    icon={<FiEdit />}
                    aria-label="Editar contrato"
                    onClick={() => navigate(`/app/contratos/editar/${id}`)}
                />
            </Tooltip>
        </HStack>
    );
};

