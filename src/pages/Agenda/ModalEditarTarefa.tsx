import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../../stores/useDarkMode";
import { editarTarefa } from "./api";
import { notify } from "../../components/notify";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
    FormControl,
    FormLabel,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { TTarefa } from "./Types";

export const ModalEditarTarefa = ({ tarefa, reload }: { tarefa: TTarefa; reload: Function }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [texto, setTexto] = useState(tarefa.texto);
    const [data, setData] = useState("");

    const loadDate = () => {
        let today = new Date(tarefa.data);
        let dia = today.getDate().toString();
        let mes = (today.getMonth() + 1).toString();
        let ano = today.getFullYear().toString();
        let hora = today.getHours().toString();
        let minuto = today.getMinutes().toString();

        if (dia.length == 1) dia = "0" + dia;
        if (mes.length == 1) mes = "0" + mes;
        if (hora.length == 1) hora = "0" + hora;
        if (minuto.length == 1) minuto = "0" + minuto;

        let fullDate = ano + "-" + mes + "-" + dia + "T" + hora + ":" + minuto;
        setData(fullDate);
    };

    useEffect(() => {
        loadDate();
    }, []);

    const colors = useDarkMode((state) => state.colors);

    const handleUpdate = async () => {
        setIsLoading(true);

        const response = await editarTarefa(navigate, { id: tarefa.id, titulo, texto, data });
        if (response.status === 200) {
            notify("Tarefa editada com sucesso!", "success");
            setIsLoading(false);
            reload();
            setOpen(false);
        } else {
            notify("Erro ao editada tarefa!", "error");
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setData(new Date(tarefa.data).toISOString().split("T")[0]);
        setTitulo(tarefa.titulo);
        setTexto(tarefa.texto);
    };

    const onOpen = () => {
        setOpen(true);
        loadDate();
    };

    return (
        <>
            <Button size="sm" onClick={onOpen}>
                Editar
            </Button>
            <Modal isOpen={open} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Editar Tarefa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Título</FormLabel>
                            <Input
                                size="sm"
                                autoFocus
                                placeholder="Título"
                                value={titulo}
                                onChange={(event) => setTitulo(event.target.value)}
                            />
                            <FormLabel mt={3}>Texto</FormLabel>
                            <Textarea
                                size="sm"
                                autoFocus
                                placeholder="Texto"
                                value={texto}
                                onChange={(event) => setTexto(event.target.value)}
                            />
                            <FormLabel mt={3}>Data</FormLabel>
                            <Input
                                size="sm"
                                type="datetime-local"
                                value={data}
                                onChange={(event) => setData(event.target.value)}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        {isLoading ? (
                            <Spinner color={colors.default} mr={3} />
                        ) : (
                            <Button colorScheme="linkedin" size="sm" onClick={handleUpdate}>
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

