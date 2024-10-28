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
} from "@chakra-ui/react";
import { useState } from "react";
import { criaCategoria } from "./api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { notify } from "../../components/notify";
import useDarkMode from "../../stores/useDarkMode";

export const CategoriaCreate = () => {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const navigate = useNavigate();
    const colors = useDarkMode((state) => state.colors);
    const reloadData = useOutletContext() as Function;

    const handleClose = () => {
        navigate("/app/anotacoes/categorias");
    };

    const handleSave = async () => {
        try {
            if (titulo === "") {
                notify("Insira um título", "error");
                return;
            }

            const data = {
                titulo: titulo,
                descricao: descricao,
            };

            const response = await criaCategoria(data, navigate);

            if (response.status === 201) {
                reloadData();
                notify("Categoria criada com sucesso", "success");
                handleClose();
            } else {
                notify("Erro ao criar categoria", "error");
            }
        } catch {
            notify("Erro ao criar categoria", "error");
        }
    };

    return (
        <Modal isOpen={true} onClose={handleClose} isCentered size="sm">
            <ModalOverlay />
            <ModalContent bg={colors.bg} textColor={colors.text}>
                <ModalHeader>
                    Cadastrar Categoria
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <FormControl>
                        <FormLabel>Título</FormLabel>
                        <Input
                            size="sm"
                            type="text"
                            placeholder="Título"
                            value={titulo}
                            onChange={(event) => setTitulo(event.target.value)}
                        />

                        <FormLabel mt={3}>Descrição</FormLabel>
                        <Input
                            size="sm"
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(event) => setDescricao(event.target.value)}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button size="sm" colorScheme={"linkedin"} onClick={handleSave}>
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

