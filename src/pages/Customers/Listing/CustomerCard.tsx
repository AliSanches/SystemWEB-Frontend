import { useNavigate } from "react-router-dom";
import useDarkMode from "../../../stores/useDarkMode.js";
import { HStack, Avatar, Text, VStack, Tag } from "@chakra-ui/react";

type Customer = {
    id: number;
    name: string;
    gender: string;
    birthdate: string;
    age: number;
    processes: any[];
};

export const CustomerCard = ({ customer }: { customer: Customer }): JSX.Element => {
    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    return (
        <HStack
            cursor={"pointer"}
            onClick={() => navigate("/app/clientes/" + customer.id + "/detalhes")}
            bg={colors.bg}
            borderRadius="10px"
            display={{ base: "flex", sm: "flex" }}
            flexDirection={{ base: "column", md: "initial" }}
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems={{ base: "center", md: "center" }}
            padding="10px"
            gap={{ md: 3, lg: 5 }}
            width={{ base: "260px", md: "100%" }}
            _hover={{
                bg: colors.cardHover,
                width: "99%",
                transition: "ease-in-out 0.1s",
            }}
        >
            <Avatar name={customer.name} />
            <Text w={"150px"} mr={{ lg: "auto" }} textAlign={"center"}>
                {customer.name}
            </Text>

            <Tag
                textAlign={"center"}
                w={{ lg: "100px" }}
                colorScheme={customer.processes.length > 0 ? "blue" : "yellow"}
            >
                {customer.processes.length > 0 ? (
                    <p>
                        {customer.processes.length} {customer.processes.length > 1 ? "processos" : "processo"}
                    </p>
                ) : (
                    <p>Nenhum processo</p>
                )}
            </Tag>

            <Text w={{ lg: "150px" }} textAlign={{ md: "center" }}>
                Gênero: {customer.gender}
            </Text>

            <VStack alignItems={"center"}>
                <Text textAlign={{ md: "center" }}>
                    {customer.gender === "F" ? "Nascida" : "Nascido"} em {customer.birthdate}
                </Text>
                {customer.age !== 0 ? (
                    <Text>
                        {customer.age} {customer.age > 1 ? "anos" : "ano"}
                    </Text>
                ) : (
                    <Text fontStyle="italic">Idade inválida</Text>
                )}
            </VStack>
        </HStack>
    );
};

