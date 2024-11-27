import ConfirmDeletion from "@/components/ConfirmDeletionModal.js";
import useDarkMode from "@/stores/useDarkMode.js";
import useUserStore from "@/stores/user.js";
import {
    Button,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { notify } from "@/components/notify.js";

export const ContactsModal = ({ user, reloadData }) => {
    const colors = useDarkMode((state) => state.colors);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const token = useUserStore((state) => state.token);

    const fetcher = async () =>
        fetch(`${import.meta.env.VITE_API_URL}/messages/get-not-added/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setContacts(data);
                if (data.length > 0) setSelected(data[0].id);
            })
            .then(() => setLoading(false));

    const [availableContacts, setContacts] = useState(fetcher);
    const [loading, setLoading] = useState(true);
    const [idSelected, setSelected]: [idSelected: null | number, setSelected: any] = useState(null);

    const handleAdicionarContato = async () => {
        const user = await JSON.parse(localStorage.getItem("user")!).state;
        const token = user.token;

        fetch(`${import.meta.env.VITE_API_URL}/messages/add-contact`, {
            body: JSON.stringify({
                user: user.id,
                contact: idSelected,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            notify("Contato adicionado", "success");
            reloadData();
        });
    };

    return (
        <>
            <IconButton size="sm" onClick={onOpen} icon={<FiUsers />} aria-label="Contatos" />
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalContent w={{ base: "260px", sm: "50vh" }} backgroundColor={colors.bg}>
                    <ModalHeader>
                        <Text>Contatos</Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <VStack>
                            {!loading && (
                                <HStack w="100%" display={"flex"} flexDirection={"column"} alignItems={"initial"}>
                                    <Select
                                        isDisabled={availableContacts.length == 0}
                                        onChange={(event) => setSelected(+event.target.value)}
                                    >
                                        {availableContacts.map((contact) => (
                                            <option key={Math.random()} value={contact.id}>
                                                {contact.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Button isDisabled={availableContacts.length == 0} onClick={handleAdicionarContato}>
                                        Adicionar
                                    </Button>
                                </HStack>
                            )}
                            {user.contacts.map((contact) => (
                                <Contact
                                    key={Math.random()}
                                    contact={contact}
                                    reloadData={reloadData}
                                    onClose={onClose}
                                />
                            ))}
                        </VStack>
                    </ModalBody>
                    <ModalFooter mr={"auto"}>
                        <Button onClick={onClose}>Voltar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const Contact = ({ contact, reloadData, onClose }) => {
    const colors = useDarkMode((state) => state.colors);

    let body = {
        user: 1,
        contact: 2,
    };

    const handleDeletion = async () => {
        let query = await axios
            .put(`${import.meta.env.VITE_API_URL}/messages/remove-contact`, body)
            .then((res) => res.data);

        notify("Contato removido", "success");
        onClose();
        reloadData();
    };

    return (
        <HStack
            display={"flex"}
            gap={3}
            css={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
            }}
            backgroundColor={colors.darkerbg}
            transition="1s ease"
        >
            <Text mr={"auto"} fontSize="md" color={colors.text}>
                {contact.name}
            </Text>
            <ConfirmDeletion entity="usuário" text="" handleDeletion={handleDeletion} />
        </HStack>
    );
};

