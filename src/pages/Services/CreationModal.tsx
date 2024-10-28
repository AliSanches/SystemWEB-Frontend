import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useDarkMode from "../../stores/useDarkMode";
import { createService } from "./api";
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
} from "@chakra-ui/react";

export const ModalCriacaoServico = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fetchServices = useOutletContext() as Function;

    const colors = useDarkMode((state) => state.colors);

    const handleCreation = async () => {
        setIsLoading(true);

        const response = await createService({ name }, navigate);
        if (response.status === 200) {
            notify("Serviço criado com sucesso!", "success");
            setIsLoading(false);
            fetchServices();
            navigate("/app/serviços");
        } else {
            notify("Erro ao criar serviço!", "error");
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={() => navigate("/app/serviços")} isCentered>
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>Criar um novo serviço</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            size="sm"
                            autoFocus
                            placeholder="Nome"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    {isLoading ? (
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
};

