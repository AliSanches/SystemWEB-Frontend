import useUserStore from "@/stores/user.js";
import { useQuery } from "@tanstack/react-query";
import { ChatCard } from "./ChatCard.js";
import axios from "axios";

export const Messages = ({ contacts, selected }) => {
    const me = useUserStore((state) => state.id);

    const fetcher = async () => {
        const user = await JSON.parse(localStorage.getItem("user")!).state;
        const token = user.token;

        return axios
            .get(`${import.meta.env.VITE_API_URL}/messages/chat/${me}/${contacts[selected].id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response.data);
    };

    const { data: messages, isLoading } = useQuery({
        queryKey: ["get-messages", selected],
        queryFn: fetcher,
        refetchInterval: 1000,
    });

    if (!isLoading && messages)
        return (
            <>
                {messages.map((message) => (
                    <ChatCard key={Math.random()} message={message} />
                ))}
            </>
        );
};

