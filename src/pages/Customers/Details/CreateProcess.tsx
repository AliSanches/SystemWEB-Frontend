import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spinner,
    Text,
} from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode";
import { useState } from "react";
import { listServices } from "../../Services/api";
import { useNavigate, useParams } from "react-router-dom";
import { createProcess } from "./api";
import { notify } from "../../../components/notify";

export const CreateProcess = ({ isOpen, onClose, reloadData }) => {
    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);

    const [loadingServices, setLoadingServices] = useState(true);
    const fetchServices = async () => {
        try {
            setLoadingServices(true);
            const request = await listServices(navigate);
            setLoadingServices(false);

            if (request.status === 200) {
                setServices(request.data);
                setServiceId(request.data[0].id);
            } else return setServices([]);
        } catch {
            return setServices([]);
        }
    };

    const [services, setServices] = useState(() => fetchServices());
    const [serviceId, setServiceId] = useState("1");
    const [processTitle, setTitle] = useState("");
    const { customerId } = useParams() as { customerId: string };

    const handleCreation = async () => {
        try {
            const query = await createProcess(
                { name: processTitle, serviceId: +serviceId, customerId: +customerId },
                navigate
            );

            if (query.status === 201) {
                notify("Processo criado com sucesso", "success");
                setTitle("");
                onClose();
                fetchServices();
            } else {
                notify("Erro ao criar processo", "error");
            }
            reloadData();
        } catch {
            notify("Erro ao criar processo", "error");
        }
    };

    if (services.length >= 1)
        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader display="flex">
                        Iniciar processo
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel htmlFor="input-titulo">Título</FormLabel>
                            <Input
                                size="sm"
                                autoFocus
                                id="input-titulo"
                                value={processTitle}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                            <FormLabel mt={3} htmlFor="select-servico">
                                Serviço prestado
                            </FormLabel>
                            <Select
                                size="sm"
                                colorScheme={"linkedin"}
                                id="select-servico"
                                value={serviceId}
                                onChange={(event) => setServiceId(event.target.value)}
                            >
                                {!loadingServices &&
                                    services.map((service) => (
                                        <option
                                            style={{ backgroundColor: colors.bg }}
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ))}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        {loadingServices ? (
                            <Spinner color={colors.default} mr={3} />
                        ) : (
                            <Button size="sm" colorScheme="linkedin" onClick={handleCreation}>
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>Aviso</ModalHeader>
                <ModalBody>
                    <Text>
                        Para iniciar um processo é necessário primeiramente cadastrar um serviço a ser executado{" "}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button mr="auto" onClick={onClose}>
                        Voltar
                    </Button>
                    <Button colorScheme="linkedin" onClick={() => navigate("/app/serviços/cadastro")}>
                        Criar serviço
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

