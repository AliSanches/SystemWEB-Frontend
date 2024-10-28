import { IconButton, Box, useDisclosure, HStack, VStack, Slide, useOutsideClick } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { FiMessageSquare } from "react-icons/fi";
import useDarkMode from "@/stores/useDarkMode.js";
import useUserStore from "@/stores/user.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ContactTabs } from "./Contacts.js";
import { ChatHeader } from "./ChatHeader.js";
import { Footer } from "./Footer.js";
import { Messages } from "./Messages.js";

export const ChatPage = () => {
    const colors = useDarkMode((state) => state.colors);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const chatRef = useRef<HTMLDivElement | null>(null);

    const authToken = useUserStore((user) => user.token);

    const fetcher = async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/messages/notifications`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.data);

    const {
        data: notifications,
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ["get-notifications"],
        queryFn: fetcher,
        refetchInterval: 1000,
    });

    useOutsideClick({
        ref: chatRef,
        handler: onClose,
    });

    useEffect(() => {
        if (isSuccess && notifications) {
            new Notification("Nova mensagem", { body: notifications.content });
        }
    }, [notifications]);

    Notification.requestPermission();

    return (
        <Box zIndex={10}>
            <IconButton
                onClick={onOpen}
                aria-label="open chat"
                bg={colors.bg}
                color={""}
                _hover={{ bg: colors.darkerbg }}
                icon={<FiMessageSquare />}
            />
            <Slide in={isOpen}>
                <Box ref={chatRef}>
                    <Chat onClose={onClose} />
                </Box>
            </Slide>
        </Box>
    );
};

const Chat = ({ onClose }) => {
    const userId = useUserStore((user) => user.id);

    const loader = async () => {
        const user = await JSON.parse(localStorage.getItem("user")!).state;
        const token = user.token;

        return axios
            .get(`${import.meta.env.VITE_API_URL}/messages/contacts/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => res.data);
    };

    const { data, isLoading: loading } = useQuery({ queryKey: ["get-contacts"], queryFn: loader });
    const [selectedChat, setSelected] = useState(0);

    const { data: messages } = useQuery({ queryKey: ["get-messages", selectedChat] });

    useEffect(() => {
        const chat = document.getElementById("chat");
        if (chat) chat!.scrollTop = chat!.scrollHeight;
    }, [data, messages, selectedChat]);

    if (!loading && data.contacts.length >= 1)
        return (
            <HStack
                minW="600px"
                w="35vw"
                h="calc(100vh - 90px)"
                position="fixed"
                right={"5px"}
                bg="whitesmoke"
                boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
                top="85px"
                borderRadius={10}
                overflow="hidden"
                alignItems={"top"}
                columnGap={0}
            >
                <ContactTabs setSelected={setSelected} contacts={data.contacts} onClose={onClose} />
                <VStack flex={2} h="100%" w="50%" alignItems={"left"} rowGap={0}>
                    <ChatHeader selectedChat={data.contacts[selectedChat]} />
                    <VStack
                        id="chat"
                        bg="rgb(220,220,220)"
                        alignItems={"left"}
                        p="5px"
                        w="100%"
                        h="100%"
                        overflowY="scroll"
                        //backgroundImage="https://m.media-amazon.com/images/I/71lngyNsKmL.jpg"
                        //backgroundSize="cover"
                        //backgroundRepeat="no-repeat"
                        //backgroundPosition="center"
                    >
                        <Messages contacts={data.contacts} selected={selectedChat} />
                    </VStack>
                    <Footer contacts={data.contacts} selected={selectedChat} />
                </VStack>
            </HStack>
        );
};

