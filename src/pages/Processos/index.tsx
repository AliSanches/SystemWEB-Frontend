import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    VStack,
    useDisclosure,
    Spinner,
    IconButton,
    Icon,
} from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Chrono } from "react-chrono";
import useDarkMode from "../../stores/useDarkMode";
import { useState } from "react";
import { createNote, getProcess, listNotes, updateNote } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../components/notify";
import { FiEdit } from "react-icons/fi";
import { ModalEncerrarProcesso } from "./ModalEncerrarProcesso";
import { ModalReabrirProcesso } from "./ModalReabrirProcesso";
import useUserStore from "../../stores/user";

export const Acompanhamento = () => {
    const { processId } = useParams() as { processId: string };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const [loading, setLoading] = useState(true);
    const [process, setProcess] = useState({ active: true });

    const fetchNotes = async () => {
        setLoading(true);
        try {
            let request = await listNotes(processId, navigate);
            let processData = await getProcess(processId, navigate);

            if (request.status === 200 && processData.status === 200) {
                setProcess(processData.data);
                setLoading(false);
                return setNotes(request.data);
            } else {
                setLoading(false);
                return setNotes([]);
            }
        } catch {
            setLoading(false);
            return setNotes([]);
        }
    };

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handleCreation = async () => {
        try {
            const query = await createNote({ processId, title, text }, navigate);
            if (query.status === 200) {
                notify("Atualização criada com sucesso!", "success");
                fetchNotes();
                onClose();
            }
        } catch {
            notify("Erro ao criar atualização!", "error");
        }
    };

    const [notes, setNotes] = useState(() => fetchNotes());
    const colors = useDarkMode((state) => state.colors);

    return (
        <VStack w="100%" alignItems="left">
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text} minWidth={"50vw"} minHeight={"50vh"}>
                    <ModalHeader>Atualizar status do processo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Título</FormLabel>
                            <Input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Status do processo"
                            />
                            <FormLabel mt={3}>Texto / Comentário</FormLabel>
                            <Textarea height={"2xs"} value={text} onChange={(event) => setText(event.target.value)} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="linkedin" onClick={handleCreation}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#/app/">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink>Processos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Acompanhar</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {permissions.processos === 2 ? (
                <>
                    {process.active ? (
                        <HStack w="100%" justifyContent="flex-end">
                            <ModalEncerrarProcesso reloadData={fetchNotes} />
                            <Button size="sm" colorScheme="linkedin" variant={"solid"} onClick={onOpen}>
                                Inserir atualização
                            </Button>
                        </HStack>
                    ) : (
                        <ModalReabrirProcesso reloadData={fetchNotes} />
                    )}
                </>
            ) : null}
            {loading ? (
                <HStack w={"100%"} justifyContent={"center"}>
                    <Spinner size={"lg"} color={colors.default} />
                </HStack>
            ) : (
                <>
                    <Text alignSelf="center" fontSize="lg">
                        Andamento do processo
                    </Text>
                    <Timeline notes={notes} fetchNotes={fetchNotes} />
                </>
            )}
        </VStack>
    );
};

const NoteBody = ({ note, fetchNotes }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const permissions = useUserStore((state) => state.permissions);

    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const request = await updateNote(note.id, { title, text }, navigate);
            if (request.status === 200) {
                notify("Nota editada com sucesso!", "success");
                onClose();
                fetchNotes();
            }
        } catch {
            notify("Erro ao editar nota!", "error");
        }
    };

    const colors = useDarkMode((state) => state.colors);

    return (
        <VStack w="100%" alignItems={"flex-end"}>
            {permissions.processos === 2 ? (
                <IconButton
                    size="sm"
                    onClick={onOpen}
                    maxWidth={"fit-content"}
                    aria-label={"Editar atualização"}
                    icon={<Icon as={FiEdit} />}
                />
            ) : null}
            <Text fontStyle="italic">{note.text}</Text>
            <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Editar status</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Título</FormLabel>
                            <Input
                                size="sm"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Status do processo"
                            />
                            <FormLabel mt={3}>Comentário</FormLabel>
                            <Textarea size="sm" onChange={(event) => setText(event.target.value)} value={text} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" colorScheme="linkedin" onClick={handleSave}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

const Timeline = ({ notes, fetchNotes }) => {
    const colors = useDarkMode((state) => state.colors);

    let items = notes.map((note) => {
        return {
            cardTitle: note.title,
            date: new Date(note.createdAt),
            cardSubtitle: "- " + note.user.name,
        };
    });

    return (
        <Chrono
            items={items}
            mode="VERTICAL"
            theme={{
                primary: colors.default,
                secondary: colors.darkerbg,
                cardBgColor: colors.bg,
                titleColor: "black",
                titleColorActive: colors.default,
            }}
            scrollable="false"
            hideControls="true"
            titleDateFormat="DD/MM/YYYY HH:MM"
            classNames={{
                card: "custom-card",
            }}
            disableAutoScrollOnClick
            disableClickOnCircle
            disableNavOnKey
            disableToolbar
            useReadMore={false}
        >
            {notes.map((note) => {
                return <NoteBody key={Math.random()} note={note} fetchNotes={fetchNotes} />;
            })}
        </Chrono>
    );
};

