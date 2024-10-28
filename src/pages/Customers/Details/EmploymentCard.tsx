import { Button, Checkbox, HStack, Input, Text, VStack } from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode";
import { useState } from "react";
import { TEmployment } from "./Employment";
import { getToday } from "../../../components/getToday";
import { useNavigate, useParams } from "react-router-dom";
import { createEmployment, deleteEmployment, updateEmployment } from "./api";
import { notify } from "../../../components/notify";
import useUserStore from "../../../stores/user";
import { useQueryClient } from "@tanstack/react-query";

interface EmploymentCardProps {
    data?: TEmployment;
    cancelCreation?: Function;
    creation?: boolean;
    reload?: Function;
}

export const EmploymentCard = ({ cancelCreation, creation, data, reload }: EmploymentCardProps): JSX.Element => {
    const [startDate, setStart] = useState(() => (data ? data.startDate : getToday()));
    const [endDate, setEnd] = useState(() => (data ? data.endDate : getToday()));
    const [company, setCompany] = useState(() => (data ? data.company : ""));
    const [position, setPosition] = useState(() => (data ? data.position : ""));
    const [considerGracePeriod, setConsiderGracePeriod] = useState(() => (data ? data.considerGracePeriod : false));
    const [periodIsSpecial, setPeriodIsSpecial] = useState(() => (data ? data.periodIsSpecial : false));
    const permissions = useUserStore((state) => state.permissions);
    const [disabled] = useState(permissions.clientes !== 2);

    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();
    const { customerId } = useParams();
    const queryClient = useQueryClient();

    const save = async () => {
        try {
            if (data) {
                const updateData = {
                    id: data.id,
                    company,
                    position,
                    startDate,
                    endDate,
                    periodIsSpecial,
                    considerGracePeriod,
                };
                const query = await updateEmployment(updateData, navigate);
                if (query.status === 200) {
                    notify("Vinculo atualizado com sucesso", "success");
                    reload!();
                    queryClient.invalidateQueries({ queryKey: ["list-employments"] });
                }
            } else {
                const createData = {
                    company,
                    position,
                    startDate,
                    endDate,
                    periodIsSpecial,
                    customerId: customerId!,
                    considerGracePeriod,
                };
                const query = await createEmployment(createData, navigate);
                if (query.status === 201) {
                    notify("Vinculo atualizado com sucesso", "success");
                    reload!();
                    cancelCreation!();
                    queryClient.invalidateQueries({ queryKey: ["list-employments"] });
                }
            }
        } catch {
            notify("Erro ao salvar vinculo", "error");
        }
    };

    const remove = async () => {
        try {
            const query = await deleteEmployment(data!.id!, navigate);

            if (query.status === 200) {
                notify("Vinculo removido com sucesso", "success");
                reload!();
                queryClient.invalidateQueries({ queryKey: ["list-employments"] });
            }
        } catch {
            notify("Erro ao remover vinculo", "error");
        }
    };

    const getDurationString = () => {
        const days = data?.durationDays === 1 ? "dia" : "dias";
        const months = data?.durationMonths === 1 ? "mês" : "meses";
        const years = data?.durationYears === 1 ? "ano" : "anos";

        let durationString = "Duração de ";

        if (data?.durationYears! > 0) durationString += `${data?.durationYears} ${years}, `;
        if (data?.durationMonths! > 0) durationString += `${data?.durationMonths} ${months} e `;
        if (data?.durationDays! > 0) durationString += `${data?.durationDays} ${days}`;

        if (data?.durationDays! + data?.durationMonths! + data?.durationYears! > 0) return durationString;
    };

    return (
        <VStack
            bg={colors.bg}
            borderRadius="10px"
            padding="10px"
            width="100%"
            margin={creation ? "1rem" : "0"}
            boxShadow={creation === true ? "0 0 5px 1px rgb(150,150,150)" : "none"}
        >
            <HStack width="100%">
                <VStack width="80%">
                    <Input
                        size="sm"
                        disabled={disabled}
                        autoFocus={!!creation}
                        placeholder="Empresa"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                    />
                    <Input
                        size="sm"
                        disabled={disabled}
                        placeholder="Atividade"
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                    />
                </VStack>
                <VStack width="20%" alignItems="end">
                    <HStack>
                        <Text>Inicio:</Text>
                        <Input
                            size="sm"
                            disabled={disabled}
                            type="date"
                            value={startDate}
                            onChange={(event) => setStart(event.target.value)}
                            minWidth="fit-content"
                            width="fit-content"
                        />
                    </HStack>
                    <HStack>
                        <Text>Termino:</Text>
                        <Input
                            size="sm"
                            disabled={disabled}
                            type="date"
                            value={endDate}
                            onChange={(event) => setEnd(event.target.value)}
                            width="fit-content"
                            minWidth="fit-content"
                        />
                    </HStack>
                </VStack>
            </HStack>

            <HStack width="100%">
                <Checkbox
                    disabled={disabled}
                    isChecked={considerGracePeriod}
                    onChange={(event) => setConsiderGracePeriod(event.target.checked)}
                >
                    Contar carências
                </Checkbox>
                <Checkbox
                    disabled={disabled}
                    isChecked={periodIsSpecial}
                    onChange={(event) => setPeriodIsSpecial(event.target.checked)}
                >
                    Período especial
                </Checkbox>

                {!creation ? (
                    <Text marginLeft="auto" marginRight="auto">
                        {getDurationString()}
                    </Text>
                ) : null}

                {data?.considerGracePeriod ? (
                    <Text marginLeft="auto" marginRight="auto">
                        {data?.gracePeriodMonths} meses de carências
                    </Text>
                ) : null}

                {!cancelCreation ? (
                    <Button size="sm" isDisabled={disabled} colorScheme={"red"} onClick={remove}>
                        Deletar
                    </Button>
                ) : (
                    <Button size="sm" isDisabled={disabled} marginLeft="auto" onClick={() => cancelCreation()}>
                        Cancelar
                    </Button>
                )}

                <Button size="sm" isDisabled={disabled} colorScheme={"linkedin"} onClick={save}>
                    Salvar
                </Button>
            </HStack>
        </VStack>
    );
};

