import { useState, useEffect, Suspense } from "react";
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
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { listUsers, deleteUser } from "./api";
import CreateUser from "./createUserModal";
import useUserStore from "../../stores/user";
import UpdateUser from "./updateUserModal";
import useDarkMode from "../../stores/useDarkMode";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/notify";
import ConfirmDeletion from "../../components/ConfirmDeletionModal";
import UpdateSelfUser from "./updateSelfModal";
import { PermissoesModal } from "./permissoesModal";
import { AccessDenied } from "../../components/AccessDenied";
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

function UserCard({ user, reloadData, users }) {
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
            backgroundColor={colors.bg}
            transition="1s ease"
        >
            <Avatar name={user.name} />
            <VStack justifyContent="left" alignItems="left" rowGap="0">
                <Text fontSize="xl" color={colors.text}>
                    {user.name}
                </Text>
                <Text fontSize="sm" color={colors.text}>
                    {user.email}
                </Text>
            </VStack>
            <Tag colorScheme={user.enabled ? "linkedin" : "red"} ml="auto">
                {user.enabled ? "Habilitado" : "Desabilitado"}
            </Tag>
            {email === user.email ? (
                <>
                    <UpdateSelfUser user={user} reloadData={reloadData} />
                </>
            ) : permissions.usuarios === 2 ? (
                <>
                    <ConfirmDeletion entity="usuário" text="" handleDeletion={handleDeletion} />
                    <UpdateUser user={user} reloadData={reloadData} />
                    <PermissoesModal user={user} reloadData={reloadData} permissions={user.permissions} />
                </>
            ) : null}

            <ContactsModal user={user} reloadData={reloadData} />
        </HStack>
    );
}

