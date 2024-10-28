import ConfirmDeletion from "../../components/ConfirmDeletionModal";
import useDarkMode from "../../stores/useDarkMode";
import { HStack, Text, Tag } from "@chakra-ui/react";
import UpdateService from "./updateService";
import { deleteService } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import { DeniedDeletionModal } from "./DeniedDeletionModal";
import useUserStore from "../../stores/user";

export const ServiceCard = ({ service, reloadData }) => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const handleDeletion = async () => {
        try {
            const request = await deleteService(service.id, navigate);

            if (request.status === 200) {
                notify("Deletado com sucesso", "success");

                reloadData();
            }
        } catch {
            notify("Erro", "error");
        }
    };

    return (
        <HStack w="100%" bg={colors.bg} padding="10px" borderRadius="5px" justifyContent="space-between">
            <Text>{service.name}</Text>
            <Tag ml="auto" colorScheme="linkedin">
                {service._count.processes
                    ? service._count.processes > 1
                        ? `${service._count.processes} Processos`
                        : `${service._count.processes} Processo`
                    : "Nenhum processo"}
            </Tag>
            {service.enabled ? <Tag colorScheme="green">Habilitado</Tag> : <Tag colorScheme="gray">Desatibilitado</Tag>}

            {permissions.servicos === 2 ? (
                <>
                    {service._count.processes ? (
                        <DeniedDeletionModal />
                    ) : (
                        <ConfirmDeletion entity="serviço" text="" handleDeletion={handleDeletion} />
                    )}

                    <UpdateService reloadData={reloadData} service={service} />
                </>
            ) : null}
        </HStack>
    );
};

