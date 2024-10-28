import { Avatar, AvatarBadge, Box, Flex } from "@chakra-ui/react";

export const ChatHeader = ({ selectedChat }) => {
    return (
        <Flex bg="whitesmoke" w="100%" position="relative" h={59} borderLeft="1.5px solid #d2d2d2" p={15}>
            <Flex gap={15} alignItems="center">
                <Avatar size="sm" name={selectedChat.name}>
                    <AvatarBadge boxSize="1.10em" bg="green.500" />
                </Avatar>
                <Box>{selectedChat.name}</Box>
            </Flex>
        </Flex>
    );
};

