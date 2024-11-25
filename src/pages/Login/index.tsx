import { Input, Flex, Image, Text, Button, Link, Divider, Checkbox, Spinner, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/user";
import useDarkMode from "../../stores/useDarkMode";

import logo from "../../../public/rocket.png";

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
        <Flex align="center" justifyContent="center" bg={colors.bg} w="100%" height="100vh" textColor={colors.text}>
            <Flex direction="column" width={{ base: "80%", md: "70%", lg: "30%" }} height="100vh" justify="center">
                <Flex direction="column" height={600}>
                    <Image src={logo} marginTop="auto" py={10} mx="auto" w={200}></Image>
                    <Divider marginTop="20px" marginBottom="20px" />
                    <Text fontWeight="bold">Email:</Text>
                    <Input
                        size="sm"
                        name="email"
                        autoComplete="email"
                        placeholder="exemplo@gmail.com"
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
                    <Flex my={3} align="left">
                        <Link color={colors.default}>Esqueci a senha</Link>
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
                </Flex>
                <HStack justifyContent={"center"} alignItems={"center"} marginTop={"auto"} marginBottom="15px">
                    <Text fontWeight="400" fontSize={{ base: "14px", md: "16x" }} alignSelf="center">
                        © Todos os Direitos Reservados - 2024
                    </Text>
                </HStack>
            </Flex>
        </Flex>
    );
}

