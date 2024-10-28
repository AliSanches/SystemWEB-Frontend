import { toast } from "react-toastify";

const handleResponse = async (response, navigate) => {
    if (response.status === 401) {
        navigate("/");
        toast("Sessão encerrada!", {
            type: "warning",
        });
        return { status: response.status, data: [] };
    } else {
        let text = await response.text();
        let json = text ? JSON.parse(text) : {};
        return { status: response.status, data: json };
    }
};

export const listUsers = async (navigate) => {
    const { token } = JSON.parse(localStorage.getItem("user")!).state;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/list`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export async function createUser(body, navigate) {
    const { token } = JSON.parse(localStorage.getItem("user")!).state;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/create`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    return handleResponse(response, navigate);
}

export async function deleteUser(userId, navigate) {
    const { token } = JSON.parse(localStorage.getItem("user")!).state;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/delete?userId=${userId}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
}

export async function updateUser(userId, data, navigate) {
    const { token } = JSON.parse(localStorage.getItem("user")!).state;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update?userId=${userId}`, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response, navigate);
}

