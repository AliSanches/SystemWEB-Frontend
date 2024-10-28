import { Button, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode";
import { useCallback, useEffect, useState } from "react";
import { EmploymentCard } from "./EmploymentCard";
import { listEmployments } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../stores/user";
import { ModalImportaCNIS } from "./ModalImportaCNIS";

export type TEmployment = {
    id?: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    durationYears?: number;
    durationMonths?: number;
    durationDays?: number;
    periodIsSpecial: boolean;
    customerId?: string;
    considerGracePeriod: boolean;
    gracePeriodMonths?: number;
};

export const Employment = (): JSX.Element => {
    const [employments, setEmployments] = useState<TEmployment[]>([]);
    const [showNewEmployment, setShowNewEmployment] = useState(false);
    const [gracePeriodMonths, setGracePeriodMonths] = useState(0);
    const [tempoDeContribuicao, setContribuicao] = useState({ anos: 0, meses: 0, dias: 0 });
    const { customerId } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);
    const colors = useDarkMode((state) => state.colors);

    const loadEmployments = useCallback(async () => {
        setLoading(true);
        const query = await listEmployments(customerId!, navigate);
        setEmployments(query.data.employments);
        setGracePeriodMonths(query.data.gracePeriodMonths);
        setContribuicao(query.data.contribuicaoTotal);

        setLoading(false);
    }, [customerId, navigate]);

    useEffect(() => {
        loadEmployments();
    }, [loadEmployments]);

    if (loading) {
        return (
            <HStack justifyContent="center">
                <Spinner color={colors.default} size="lg" />
            </HStack>
        );
    }
    return (
        <VStack>
            <HStack width="100%" alignItems="center" justifyContent="space-between" mb={3}>
                {gracePeriodMonths > 0 && (
                    <Text color={colors.default} fontWeight="bold">
                        Meses de carência: {gracePeriodMonths}
                    </Text>
                )}
                {tempoDeContribuicao.anos + tempoDeContribuicao.meses + tempoDeContribuicao.dias > 0 ? (
                    <Text ml="auto" mr="auto" color={colors.default} fontWeight="bold">
                        Contribuição: {tempoDeContribuicao.anos} anos {tempoDeContribuicao.meses} meses{" "}
                        {tempoDeContribuicao.dias} dias
                    </Text>
                ) : null}
                <ModalImportaCNIS reload={loadEmployments} />
                {permissions.clientes === 2 ? (
                    <Button size="sm" colorScheme={"linkedin"} onClick={() => setShowNewEmployment(!showNewEmployment)}>
                        {!showNewEmployment ? "Novo vínculo" : "Cancelar"}
                    </Button>
                ) : null}
            </HStack>
            {showNewEmployment && (
                <EmploymentCard cancelCreation={() => setShowNewEmployment(false)} creation reload={loadEmployments} />
            )}
            {employments.length > 0 &&
                employments.map((employment) => (
                    <EmploymentCard key={Math.random()} data={employment} reload={loadEmployments} />
                ))}
            {employments.length === 0 && !showNewEmployment && <Text>Nenhum vínculo cadastrado</Text>}
        </VStack>
    );
};

