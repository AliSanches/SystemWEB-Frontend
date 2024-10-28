import {
    Box,
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
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    VStack,
    useDisclosure,
    useSteps,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiArrowRight, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import useDarkMode from "../../stores/useDarkMode";
import { createUser } from "./api";
import useUserStore from "../../stores/user";

export default function CreateUser({ reloadData }: { reloadData: () => void }): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const colors = useDarkMode((state) => state.colors);

    const [perms, setPerms] = useState({
        clientes: 0,
        processos: 0,
        servicos: 0,
        usuarios: 0,
        anotacoes: 0,
        relatorios: 0,
        contratos: 0,
        configuracoes: 0,
    });

    const navigate = useNavigate();

    const handleCreation = async () => {
        setLoading(true);
        if (!name || !email || !password) {
            notify("Preencha todos os campos", "warning");
            setLoading(false);
            goToPrevious();
        } else {
            const response = await createUser({ name, email, password, permissions: perms }, navigate);
            if (response.status === 201) {
                reloadData();
                setName("");
                setEmail("");
                setPassword("");
                setActiveStep(0);

                handleClose();
                notify("Usuário criado com sucesso", "success");
            } else {
                goToPrevious();
                notify(response.data, "warning");
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
        setActiveStep(0);
        onClose();
    };

    const steps = [
        { title: "Login", description: "Dados de login" },
        { title: "Permissões", description: "Permissões do sistema" },
    ];

    const { activeStep, goToNext, setActiveStep, goToPrevious } = useSteps({
        index: 0,
        count: steps.length,
    });

    return (
        <>
            <Button size="sm" onClick={onOpen} colorScheme={"linkedin"} marginLeft="auto">
                Adicionar
            </Button>
            <Modal size="sm" isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />

                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader>Cadastrar usuário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stepper index={activeStep} size={"sm"} mb={3}>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>

                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === 0 ? (
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
                                    Senha
                                </FormLabel>
                                <Input
                                    size="sm"
                                    id="input-password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") goToNext();
                                    }}
                                />
                            </FormControl>
                        ) : (
                            <VStack>
                                <Box w="100%">
                                    <p>Clientes</p>
                                    <Select
                                        size="sm"
                                        value={perms.clientes}
                                        onChange={(event) => setPerms({ ...perms, clientes: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Consulta</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>

                                {perms.clientes >= 1 ? (
                                    <Box w="100%">
                                        <p>Processos</p>
                                        <Select
                                            size="sm"
                                            value={perms.processos}
                                            onChange={(event) => setPerms({ ...perms, processos: +event.target.value })}
                                        >
                                            <option value={0}>Sem acesso</option>
                                            <option value={1}>Consulta</option>
                                            <option value={2}>Acesso Total</option>
                                        </Select>
                                    </Box>
                                ) : null}

                                <Box w="100%">
                                    <p>Serviços</p>
                                    <Select
                                        size="sm"
                                        value={perms.servicos}
                                        onChange={(event) => setPerms({ ...perms, servicos: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Consulta</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>

                                <Box w="100%">
                                    <p>Controle de Usuários</p>
                                    <Select
                                        size="sm"
                                        value={perms.usuarios}
                                        onChange={(event) => setPerms({ ...perms, usuarios: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Consulta</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>

                                <Box w="100%">
                                    <p>Anotações</p>
                                    <Select
                                        size="sm"
                                        value={perms.anotacoes}
                                        onChange={(event) => setPerms({ ...perms, anotacoes: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Consulta</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>

                                <Box w="100%">
                                    <p>Contratos</p>
                                    <Select
                                        size="sm"
                                        value={perms.contratos}
                                        onChange={(event) => setPerms({ ...perms, contratos: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Emissão</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>

                                <Box w="100%">
                                    <p>Relatórios</p>
                                    <Select
                                        size="sm"
                                        value={perms.relatorios}
                                        onChange={(event) => setPerms({ ...perms, relatorios: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Emissão</option>
                                    </Select>
                                </Box>

                                <Box w="100%">
                                    <p>Configurações</p>
                                    <Select
                                        size="sm"
                                        value={perms.configuracoes}
                                        onChange={(event) => setPerms({ ...perms, configuracoes: +event.target.value })}
                                    >
                                        <option value={0}>Sem acesso</option>
                                        <option value={1}>Consulta</option>
                                        <option value={2}>Acesso Total</option>
                                    </Select>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                    {activeStep === 0 ? (
                        <ModalFooter>
                            <Button size="sm" colorScheme={"linkedin"} columnGap={"5px"} onClick={goToNext}>
                                Avançar{<FiArrowRight />}
                            </Button>
                        </ModalFooter>
                    ) : (
                        <ModalFooter>
                            {loading ? (
                                <Spinner color={colors.default} />
                            ) : (
                                <Button size="sm" colorScheme={"linkedin"} columnGap={"5px"} onClick={handleCreation}>
                                    Salvar{<FiSave />}
                                </Button>
                            )}
                        </ModalFooter>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

