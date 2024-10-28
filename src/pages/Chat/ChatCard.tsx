import useDarkMode from "@/stores/useDarkMode.js";
import useUserStore from "@/stores/user.js";
import { Box } from "@chakra-ui/react";

export const ChatCard = ({ message }) => {
    const colors = useDarkMode((state) => state.colors);
    const me = useUserStore((state) => state.id);

    return (
        <Box
            w={"fit-content"}
            maxW={"90%"}
            ml={message.senderId === me ? "auto" : "unset"}
            borderRadius={5}
            bg={message.senderId === me ? colors.default : "whitesmoke"}
            boxShadow="2px 2px 3px #888888"
            textColor={message.senderId === me ? "white" : "black"}
        >
            <Box p={1.5}>
                <Box fontSize={13} fontWeight="bold" borderBottom="1px solid #d2d2d2">
                    <h1>{message.sender.name}</h1>
                </Box>
                <Box fontSize={15} p={1.5}>
                    <p>{message.content}</p>
                </Box>
            </Box>
        </Box>
    );
};

