import useDarkMode from "@/stores/useDarkMode.js";
import { Avatar, AvatarBadge, Box, Flex, IconButton, Tab, TabIndicator, TabList, Tabs } from "@chakra-ui/react";
import { FiChevronsRight } from "react-icons/fi";

export const ContactTabs = ({ contacts, onClose, setSelected }) => {
    const colors = useDarkMode((state) => state.colors);

    return (
        <Box flex={1}>
            <Flex h={59}>
                <Flex>
                    <IconButton
                        bg="whitesmoke"
                        aria-label="close chat"
                        size="sm"
                        fontSize={25}
                        onClick={onClose}
                        icon={<FiChevronsRight />}
                    />
                </Flex>
            </Flex>
            <Tabs orientation="vertical" variant="unstyled" onChange={(index) => setSelected(index)}>
                <TabList w="100%">
                    {contacts.map((contact) => (
                        <Tab
                            key={contact.id}
                            justifyContent="stretch"
                            mb={1}
                            p={17}
                            gap={15}
                            alignItems="center"
                            _selected={{ color: colors.default, bg: "#dbdadaa9" }}
                            _hover={{ bg: "#dbdadaa9" }}
                        >
                            <Avatar size="sm" name={contact.name}>
                                <AvatarBadge boxSize="1.10em" bg="green.500" />
                            </Avatar>
                            <Box maxW="120px" isTruncated>
                                {contact.name}
                            </Box>
                        </Tab>
                    ))}
                </TabList>
                <TabIndicator
                    mt="-1.5px"
                    height="calc(100% - 10px)"
                    borderWidth="2px"
                    borderColor="#1073b1"
                    right={0}
                />
            </Tabs>
        </Box>
    );
};

