import ConfirmDeletion from "../../components/ConfirmDeletionModal.js";
import useDarkMode from "../../stores/useDarkMode.js";
import { HStack, Text, Tag, Flex } from "@chakra-ui/react";
import UpdateService from "./updateService.js";
import { deleteService } from "./api.js";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify.js";
import { DeniedDeletionModal } from "./DeniedDeletionModal.js";
import useUserStore from "../../stores/user.js";

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
        <HStack
            w="100%"
            bg={colors.bg}
            padding="10px"
            borderRadius="5px"
            justifyContent="space-between"
            flexFlow={{ base: "column", sm: "row" }}
            alignItems={{ base: "center" }}
            textAlign={"center"}
            gap={3}
            display={{ base: "flex", sm: "flex" }}
        >
            <Text>{service.name}</Text>
            <Tag ml={{ sm: "auto" }} colorScheme="linkedin">
                {service._count.processes
                    ? service._count.processes > 1
                        ? `${service._count.processes} Processos`
                        : `${service._count.processes} Processo`
                    : "Nenhum processo"}
            </Tag>
            {service.enabled ? <Tag colorScheme="green">Habilitado</Tag> : <Tag colorScheme="gray">Desatibilitado</Tag>}

            {permissions.servicos === 2 ? (
                <Flex gap={3}>
                    {service._count.processes ? (
                        <DeniedDeletionModal />
                    ) : (
                        <ConfirmDeletion entity="serviço" text="" mt={0} handleDeletion={handleDeletion} />
                    )}

                    <UpdateService reloadData={reloadData} service={service} />
                </Flex>
            ) : null}
        </HStack>
    );
};

