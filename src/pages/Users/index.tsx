import { useState, useEffect } from "react";
import {
    VStack,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Avatar,
    HStack,
    Text,
    Spinner,
    Tag,
    Flex,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { listUsers, deleteUser } from "./api.js";
import CreateUser from "./createUserModal.js";
import useUserStore from "../../stores/user.js";
import UpdateUser from "./updateUserModal.js";
import useDarkMode from "../../stores/useDarkMode.js";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify.js";
import ConfirmDeletion from "../../components/ConfirmDeletionModal.js";
import UpdateSelfUser from "./updateSelfModal.js";
import { PermissoesModal } from "./permissoesModal.js";
import { AccessDenied } from "../../components/AccessDenied.js";
import { ContactsModal } from "./contactsModal.js";

export default function Users() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const colors = useDarkMode((state) => state.colors);

    const loadData = async () => {
        setLoading(true);
        const response = await listUsers(navigate);

        setData(response.data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return permissions.usuarios >= 1 ? (
        <VStack
            css={{
                width: "100%",
            }}
            alignItems="left"
        >
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Usuários</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <VStack>
                {permissions.usuarios === 2 ? <CreateUser reloadData={loadData} /> : null}

                {loading ? (
                    <Spinner size="lg" color={colors.default} />
                ) : (
                    data.map((user) => {
                        return <UserCard key={Math.random()} user={user} users={data} reloadData={loadData} />;
                    })
                )}
            </VStack>
        </VStack>
    ) : (
        <AccessDenied />
    );
}

function UserCard({ user, reloadData }) {
    const navigate = useNavigate();
    const permissions = useUserStore((state) => state.permissions);

    const handleDeletion = async () => {
        const response = await deleteUser(user.id, navigate);
        if (response.status === 200) {
            reloadData();
            notify("Usuário removido com sucesso", "success");
        }
    };

    const colors = useDarkMode((state) => state.colors);
    const email = useUserStore((state) => state.email);

    return (
        <HStack
            css={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
            }}
            display={{ base: "block", sm: "flex" }}
            justifyContent={{ sm: "space-between" }}
            gap={3}
            backgroundColor={colors.bg}
            transition="1s ease"
        >
            <Avatar name={user.name} />
            <VStack justifyContent="left" mr={{ sm: "auto" }} alignItems="left" rowGap="0">
                <Text fontSize="xl" color={colors.text}>
                    {user.name}
                </Text>
                <Text fontSize="sm" color={colors.text}>
                    {user.email}
                </Text>
            </VStack>
            <Flex flexDirection={{ base: "column" }} justifyContent={"center"} alignItems={{ sm: "end" }}>
                <Tag
                    colorScheme={user.enabled ? "linkedin" : "red"}
                    ml={{ base: "0", sm: "0", md: "auto" }}
                    my={1}
                    w={"100px"}
                    textAlign={"center"}
                >
                    {user.enabled ? "Habilitado" : "Desabilitado"}
                </Tag>
                {email === user.email ? (
                    <Flex>
                        <UpdateSelfUser user={user} reloadData={reloadData} />
                        <Flex mx={2}>
                            <ContactsModal user={user} reloadData={reloadData} />
                        </Flex>
                    </Flex>
                ) : permissions.usuarios === 2 ? (
                    <Flex gap={2}>
                        <ConfirmDeletion entity="usuário" text="" handleDeletion={handleDeletion} mt={0} />
                        <UpdateUser user={user} reloadData={reloadData} />
                        <PermissoesModal user={user} reloadData={reloadData} permissions={user.permissions} />
                        <Flex alignItems={{ sm: "end" }} my={{ base: 0, sm: 0 }}>
                            <ContactsModal user={user} reloadData={reloadData} />
                        </Flex>
                    </Flex>
                ) : null}
            </Flex>
        </HStack>
    );
}

