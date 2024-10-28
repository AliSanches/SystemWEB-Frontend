import { Button, Spinner, useDisclosure, VStack } from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listProcesses } from "./api";
import { CreateProcess } from "./CreateProcess";
import { ProcessCard } from "./ProcessCard";
import useUserStore from "../../../stores/user";

export const Processos = () => {
    const colors = useDarkMode((state) => state.colors);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const { customerId } = useParams() as { customerId: string };
    const permissions = useUserStore((state) => state.permissions);

    const [loadingProcesses, setLoadingProcesses] = useState(true);
    const fetchProcesses = async () => {
        try {
            setLoadingProcesses(true);
            const request = await listProcesses(customerId, navigate);

            setLoadingProcesses(false);
            if (request.status === 200) return setProcesses(request.data);
            else return setProcesses([]);
        } catch {
            return setProcesses([]);
        }
    };

    const [processes, setProcesses] = useState(() => fetchProcesses());

    return (
        <VStack h="100%">
            {permissions.processos === 2 ? (
                <Button size="sm" ml="auto" colorScheme={"linkedin"} onClick={onOpen}>
                    Iniciar um Processo
                </Button>
            ) : null}
            <VStack w="100%" rowGap={3} mt={1}>
                {!loadingProcesses &&
                    processes.map((process) => (
                        <ProcessCard reloadData={fetchProcesses} key={Math.random()} process={process} />
                    ))}
                {!loadingProcesses && processes.length === 0 && <p>Nenhum processo encontrado</p>}
                {loadingProcesses && <Spinner color={colors.default} size="lg" />}
            </VStack>

            <CreateProcess isOpen={isOpen} onClose={onClose} reloadData={fetchProcesses} />
        </VStack>
    );
};

