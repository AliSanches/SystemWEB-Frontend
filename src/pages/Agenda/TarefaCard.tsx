import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import { ModalDeletarTarefa } from "./ModalDeletarTarefa";
import { ModalEditarTarefa } from "./ModalEditarTarefa";
import { TTarefa } from "./Types";
import useDarkMode from "../../stores/useDarkMode";

export const Tarefa = ({ tarefa, reload }: { tarefa: TTarefa; reload: Function }) => {
    const colors = useDarkMode((state) => state.colors);

    let hora = new Date(tarefa.data).getHours();
    let minutos = new Date(tarefa.data).getMinutes();

    return (
        <Card w="100%" size="sm" bg={colors.bg} color={colors.text}>
            <CardHeader fontWeight="bold">
                {hora}:{minutos} - {tarefa.titulo}
            </CardHeader>
            <CardBody>
                <Text>{tarefa.texto}</Text>
            </CardBody>
            <CardFooter>
                <ModalEditarTarefa tarefa={tarefa} reload={reload} />
                <ModalDeletarTarefa id={tarefa.id} reload={reload} />
            </CardFooter>
        </Card>
    );
};

