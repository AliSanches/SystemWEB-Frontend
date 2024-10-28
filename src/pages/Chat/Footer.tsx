import { notify } from "@/components/notify.js";
import useUserStore from "@/stores/user.js";
import { Flex, Input } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Footer = ({ contacts, selected }) => {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();
    const me = useUserStore((state) => state.id);

    const sendMessage = async () => {
        const user = await JSON.parse(localStorage.getItem("user")!).state;
        const token = user.token;

        return await fetch(`${import.meta.env.VITE_API_URL}/messages/chat/${me}/${contacts[selected].id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: message }),
        })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["get-messages"] });
            })
            .catch((err) => notify("Erro ao enviar mensagem", "error"));
    };

    return (
        <Flex w="100%" p={3} position="sticky" bottom={0} bg="transparent" borderLeft="1.5px solid #d2d2d2">
            <Input
                borderColor="#d2d2d2"
                placeholder="Digite uma mensagem..."
                resize="none"
                size="sm"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && message.trim()) {
                        sendMessage();
                        setMessage("");
                    }
                }}
            />
        </Flex>
    );
};

