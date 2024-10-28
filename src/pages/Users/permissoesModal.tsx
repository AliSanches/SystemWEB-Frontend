import {
    IconButton,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Button,
    ModalCloseButton,
    Select,
    VStack,
    Box,
    Tooltip,
} from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";
import useDarkMode from "../../stores/useDarkMode";
import { useState } from "react";
import { updateUser } from "./api";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";

export const PermissoesModal = ({ permissions, user, reloadData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const [perms, setPerms] = useState({
        clientes: permissions.clientes,
        processos: permissions.processos,
        servicos: permissions.servicos,
        usuarios: permissions.usuarios,
        anotacoes: permissions.anotacoes,
        contratos: permissions.contratos,
        relatorios: permissions.relatorios,
        configuracoes: permissions.configuracoes,
    });

    const handleUpdate = async () => {
        const response = await updateUser(user.id, { permissions: perms }, navigate);

        if (response.status === 200) {
            notify("Usuário atualizado com sucesso", "success");
            reloadData();
        } else {
            notify(response.data, "warning");
        }
    };

    return (
        <>
            <Tooltip label="Configurar permissões">
                <IconButton size="sm" aria-label="permissões" icon={<FiLock />} onClick={onOpen} />
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={colors.bg} textColor={colors.text}>
                    <ModalHeader display="flex" alignItems="center" columnGap={3}>
                        Permissões <FiLock />
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                                    <option value={1}>Emitir</option>
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
                                    <option value={1}>Emitir</option>
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
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" colorScheme={"linkedin"} onClick={handleUpdate}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

