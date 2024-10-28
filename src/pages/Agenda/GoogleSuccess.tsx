import useUserStore from "@/stores/user.js";
import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    useQuery,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const GoogleSuccess = () => {
    let user = useUserStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTokens = () => {
        let token = searchParams.get("token");
        let refresh = searchParams.get("refresh");

        user.setTokens(token, refresh);
    };

    useEffect(() => {
        handleTokens();
    }, []);

    const navigate = useNavigate();

    return (
        <>
            <Modal isCentered isOpen={true} onClose={() => {}}>
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <FcGoogle />
                            <Text>Conectado com sucesso</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        <Text>Refaça o login para continuar</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => user.logout(navigate)}>Login</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

