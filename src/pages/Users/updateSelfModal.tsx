import {
    Modal,
    Button,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    ModalHeader,
    ModalBody,
    Input,
    FormControl,
    FormLabel,
    ModalFooter,
    Spinner,
    ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { updateUser } from "./api";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

export default function UpdateSelfUser({ reloadData, user }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");

    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const handleUpdate = async () => {
        setLoading(true);
        const response = await updateUser(user.id, { name, email, password, enabled: true }, navigate);
        if (response.status === 200) {
            notify("Usuário atualizado com sucesso", "success");
            reloadData();
            handleClose();
        } else {
            notify(response.data, "warning");
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Button size="sm" marginLeft="auto" colorScheme={"linkedin"} onClick={onOpen}>
                Minha Conta
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Atualizar usuário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel htmlFor="input-name">Nome</FormLabel>
                            <Input
                                size="sm"
                                id="input-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <FormLabel mt={3} htmlFor="input-email">
                                Email
                            </FormLabel>
                            <Input
                                size="sm"
                                id="input-email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <FormLabel mt={3} htmlFor="input-password">
                                Nova senha
                            </FormLabel>
                            <Input
                                size="sm"
                                id="input-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") handleUpdate();
                                }}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        {loading ? (
                            <Spinner color={colors.default} />
                        ) : (
                            <Button size="sm" colorScheme={"linkedin"} onClick={handleUpdate}>
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

