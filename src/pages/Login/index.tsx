import { Input, Flex, Image, Text, Button, Link, Divider, Checkbox, Spinner, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/user";
import useDarkMode from "../../stores/useDarkMode";

import video from "../../assets/vid-previdencia.mp4";

export default function Login() {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const user = useUserStore();
    const colors = useDarkMode((state) => state.colors);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const handleAuthentication = () => {
        user.authenticate({ email, password }, navigate, setLoading);
    };

    if (loading)
        return (
            <Flex align="center" width="100vw" height="100vh" justify="center" bg={colors.bg}>
                <Spinner size="xl" color={colors.default} />
            </Flex>
        );

    return (
        <Flex align="center" bg={colors.bg} direction="row" height="100vh" textColor={colors.text}>
            <Flex direction="column" marginLeft="auto" width="30%" height="100vh" justify="center">
                <Flex align="center" marginTop="15px" direction="row" columnGap="10px">
                    <ChevronLeftIcon />
                    <Text>Retornar ao site</Text>
                </Flex>
                <Text fontSize="4xl" fontWeight="bold" marginTop="auto">
                    Fazer login
                </Text>
                <Text>Insira seu email e senha para acessar!</Text>
                <Divider marginTop="20px" marginBottom="20px" />
                <Text fontWeight="bold">Email:</Text>
                <Input
                    size="sm"
                    name="email"
                    autoComplete="email"
                    placeholder="exemplo@sigprev.com"
                    focusBorderColor="#00B9F2"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Text marginTop="15px" fontWeight=" bold">
                    Senha:
                </Text>
                <Input
                    size="sm"
                    name="password"
                    placeholder="Min. 6 caracteres"
                    type="password"
                    focusBorderColor="#00B9F2"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleAuthentication();
                        }
                    }}
                />
                <Flex align="center" marginTop="15px">
                    <Checkbox defaultChecked name="stay-logged-checkbox">
                        Mantenha-me logado por 7 dias
                    </Checkbox>
                    <Link marginLeft="auto" color={colors.default}>
                        Esqueci a senha
                    </Link>
                </Flex>
                <Button
                    size="sm"
                    bg={colors.default}
                    _hover={{ bg: colors.buttonHover }}
                    color="white"
                    marginTop="15px"
                    onClick={handleAuthentication}
                >
                    Acessar
                </Button>
                <HStack justifyContent={"center"} alignItems={"center"} marginTop={"auto"} marginBottom="15px">
                    <Text fontWeight="400" alignSelf="center">
                        2023 - Devops Tecnologias. Feito com ❤ e ⚛
                    </Text>
                </HStack>
            </Flex>

            <Flex
                width="40vw"
                height="100vh"
                bg={colors.darkerbg}
                alignSelf="flex-end"
                alignItems="center"
                justifyContent="center"
                direction="column"
                marginLeft="auto"
                overflow="hidden"
                id="test"
            >
                <video autoPlay loop muted style={{ opacity: "0.7", width: "100%" }}>
                    <source src={video} />
                </video>

                <Image src={colors.logo} width="400px" position="absolute" />
            </Flex>
        </Flex>
    );
}

