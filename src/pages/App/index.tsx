import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Image,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import {
    FcPortraitMode,
    FcConferenceCall,
    FcSurvey,
    FcSettings,
    FcSupport,
    FcRules,
    FcAreaChart,
    FcCalendar,
    FcBullish,
    FcComboChart,
} from "react-icons/fc";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../stores/user.js";
import useDarkMode from "../../stores/useDarkMode.js";
import { ChatPage } from "../Chat/index.js";

import logo from "../../../public/rocket.png";

type TSidebarItem = {
    name: String;
    icon: any;
    link: String;
};

export default function SidebarWithHeader() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useDarkMode((state) => state.colors);

    return (
        <Box overflowY="scroll" minH="100vh" bg={colors.darkerbg} textColor={colors.text}>
            <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                <Outlet />
            </Box>
        </Box>
    );
}

const SidebarContent = ({ onClose, ...rest }) => {
    const colors = useDarkMode((state) => state.colors);
    const permissions = useUserStore((state) => state.permissions);

    const NavItems = (): TSidebarItem[] => {
        const items = [] as TSidebarItem[];

        items.push({ name: "Dashboard", icon: FcBullish, link: "#/app/dashboard" });
        if (permissions.clientes >= 1) items.push({ name: "Clientes", icon: FcConferenceCall, link: "#/app/clientes" });
        if (permissions.servicos >= 1) items.push({ name: "Serviços", icon: FcSupport, link: "#/app/serviços" });
        if (permissions.usuarios >= 1) items.push({ name: "Usuários", icon: FcPortraitMode, link: "#/app/usuarios" });
        if (permissions.contratos === 2) items.push({ name: "Contratos", icon: FcRules, link: "#/app/contratos" });

        if (permissions.anotacoes >= 1) items.push({ name: "Anotações", icon: FcSurvey, link: "#/app/anotacoes" });

        items.push({ name: "Agenda", icon: FcCalendar, link: "#/app/agenda" });

        if (permissions.ged >= 1) items.push({ name: "Ged", icon: FcComboChart, link: "#/app/gestaoEletronica" });

        if (permissions.relatorios === 1)
            items.push({ name: "Relatórios", icon: FcAreaChart, link: "#/app/relatorios" });

        if (permissions.configuracoes >= 1)
            items.push({ name: "Configurações", icon: FcSettings, link: "#/app/configuracoes" });

        return items;
    };

    return (
        <Box
            transition="1s ease"
            bg={colors.bg}
            borderRight="1px"
            borderRightColor={colors.border}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Image
                    src={logo}
                    css={{
                        maxHeight: "40px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
                <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
            {NavItems().map((link) => (
                <NavItem key={Math.random()} icon={link.icon} link={link.link}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, link, ...rest }) => {
    let url = useLocation().pathname.split("/")[2];
    url = decodeURIComponent(url);
    let url2 = link.split("/")[2];

    return (
        <Link href={link} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                bg={url == url2 ? "#0070b5" : "transparent"}
                color={url == url2 ? "white" : "black"}
                borderRadius="5px"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "#0070b5",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {
    const user = useUserStore();
    const colors = useDarkMode((state) => state.colors);
    const toggleDarkMode = useDarkMode((state) => state.toggleDarkMode);
    const navigate = useNavigate();

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={colors.default}
            borderBottomWidth="1px"
            borderBottomColor={colors.border}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <HStack spacing={{ base: "1", md: "6" }}>
                <IconButton
                    aria-label="dark mode"
                    bg={colors.bg}
                    color={colors.text}
                    _hover={{ bg: colors.darkerbg }}
                    icon={colors.darkModeOn ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                    onClick={toggleDarkMode}
                />
                <IconButton
                    aria-label="open menu"
                    bg={colors.bg}
                    color={colors.text}
                    _hover={{ bg: colors.darkerbg }}
                    icon={<FiBell />}
                />
                <ChatPage />
                <Flex
                    alignItems={"center"}
                    bg={colors.bg}
                    _hover={{ bg: colors.darkerbg }}
                    css={{ borderRadius: "10px", paddingLeft: "10px", paddingRight: "10px" }}
                >
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                            <HStack>
                                <Avatar size={"sm"} name={user.name} />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    <Text fontSize="sm">{user.name}</Text>
                                    <Text fontSize="xs">{user.empresa}</Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList bg={colors.bg} borderColor={colors.border}>
                            <MenuItem
                                bg={colors.bg}
                                _hover={{ bg: colors.darkerbg }}
                                onClick={() => user.logout(navigate)}
                            >
                                Sair
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

