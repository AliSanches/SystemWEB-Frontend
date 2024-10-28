import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../../stores/useDarkMode";
import { criarTarefa } from "./api";
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
    HStack,
    Checkbox,
    Text,
} from "@chakra-ui/react";
import { FcGoogle, FcCheckmark } from "react-icons/fc";
import useUserStore from "@/stores/user.js";

export const ModalNovaTarefa = ({ reload }: { reload: Function }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");

    const [google, setGoogle] = useState(false);

    const handleData = () => {
        let today = new Date();
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

    const [data, setData] = useState("");
    const colors = useDarkMode((state) => state.colors);
    let user = useUserStore((state) => state);

    const handleGoogleCreation = async () => {
        try {
            if (google) {
                let body = JSON.stringify({ data: data });
                let response = await fetch(
                    `${import.meta.env.VITE_API_URL}/calendario/create?summary=${titulo}&description=${texto}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            "Content-Type": "application/json",
                        },
                        body,
                    }
                );

                if (response.status == 200) return true;
            } else return true;
        } catch {
            notify("Erro ao exportar para o Google", "error");
            return true;
        }
    };

    const handleCreation = async () => {
        setIsLoading(true);

        const response = await criarTarefa(navigate, { titulo, texto, data });
        if (response.status === 200) {
            let googleCreation = await handleGoogleCreation();
            if (googleCreation) {
                notify("Tarefa criada com sucesso!", "success");
                setIsLoading(false);
                reload();
                setOpen(false);
                handleData();
                setTitulo("");
                setTexto("");
            }
        } else {
            notify("Erro ao criar tarefa!", "error");
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        handleData();
        setTitulo("");
        setTexto("");
        setGoogle(false);
    };

    const onOpen = () => {
        setOpen(true);
        handleData();
    };

    const userId = useUserStore((state) => state.id);

    return (
        <>
            <HStack ml="auto">
                {user.googleRefreshToken ? (
                    <Button
                        bg="white"
                        size="sm"
                        alignContent={"space-between"}
                        leftIcon={<FcGoogle />}
                        rightIcon={<FcCheckmark />}
                    >
                        Conectado
                    </Button>
                ) : (
                    <Button
                        bg="white"
                        size="sm"
                        alignContent={"space-between"}
                        onClick={() =>
                            window.open(`${import.meta.env.VITE_API_URL}/calendario/google-login/${userId}`, "_self")
                        }
                        leftIcon={<FcGoogle />}
                    >
                        Conectar ao Google
                    </Button>
                )}
                <Button size="sm" colorScheme="linkedin" onClick={onOpen}>
                    Nova Tarefa
                </Button>
            </HStack>
            <Modal isOpen={open} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Criar nova Tarefa</ModalHeader>
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
                                placeholder="Texto"
                                value={texto}
                                onChange={(event) => setTexto(event.target.value)}
                            />
                            <FormLabel mt={3}>Data</FormLabel>
                            <Input
                                size="sm"
                                type="datetime-local"
                                value={data}
                                onChange={(event) => {
                                    setData(event.target.value);
                                }}
                            />

                            <HStack mt={3} alignItems="center">
                                <Checkbox
                                    isChecked={google}
                                    isDisabled={user.googleRefreshToken ? false : true}
                                    onChange={() => setGoogle(!google)}
                                />
                                <Text>Criar também no calendário do Google</Text>
                            </HStack>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        {isLoading ? (
                            <Spinner color={colors.default} mr={3} />
                        ) : (
                            <Button colorScheme="linkedin" size="sm" onClick={handleCreation}>
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

