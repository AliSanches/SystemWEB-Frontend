import {
	Button,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { reabrirProcesso } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../components/notify";
import { useState } from "react";
import useDarkMode from "../../stores/useDarkMode";

export const ModalReabrirProcesso = ({ reloadData }: { reloadData: Function }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { processId } = useParams() as { processId: string };
	const navigate = useNavigate();
	const colors = useDarkMode((state) => state.colors);
	const [texto, setTexto] = useState("");

	const handleReopen = async () => {
		try {
			const query = await reabrirProcesso(processId, { texto }, navigate);
			if (query.status === 200) {
				notify("Processo reaberto com sucesso!", "success");
				reloadData();
				onClose();
			}
		} catch {
			notify("Erro ao encerrar processo!", "error");
		}
	};

	return (
		<VStack>
			<Button ml="auto" colorScheme="linkedin" variant="outline" onClick={onOpen}>
				Reabrir
			</Button>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />

				<ModalContent minWidth={"50vw"} minHeight={"50vh"} bg={colors.bg} textColor={colors.text}>
					<ModalCloseButton />

					<ModalHeader>Reabrir processo</ModalHeader>

					<ModalBody>
						<ModalBody>
							<FormLabel mt={3}>Texto / Comentário</FormLabel>
							<Textarea onChange={(event) => setTexto(event.target.value)} height={"2xs"} value={texto} />
						</ModalBody>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="linkedin" onClick={handleReopen}>
							Salvar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</VStack>
	);
};
