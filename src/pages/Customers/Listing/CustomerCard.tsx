import { useNavigate } from "react-router-dom";
import useDarkMode from "../../../stores/useDarkMode";
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
			onClick={() => navigate("/app/clientes/" + customer.id + "/detalhes")}
			bg={colors.bg}
			borderRadius="10px"
			padding="10px"
			width="100%"
			_hover={{
				bg: colors.cardHover,
				width: "99%",
				transition: "ease-in-out 0.1s",
			}}
		>
			<Avatar name={customer.name} />
			<Text>{customer.name}</Text>

			<Tag colorScheme={ customer.processes.length > 0 ? "blue" : "yellow" } ml="auto">
				{customer.processes.length > 0 ? <p>{customer.processes.length} {customer.processes.length > 1 ? "processos" : "processo" }</p> : <p>Nenhum processo</p>}
			</Tag>

			<Text ml="4rem">Gênero: {customer.gender}</Text>

			<VStack rowGap="0" marginLeft="4rem">
				<Text>
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
