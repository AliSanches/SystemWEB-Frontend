import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

const handleResponse = async (response: Response, navigate: NavigateFunction) => {
    if (response.status === 401) {
        navigate("/");
        toast("Sessão encerrada!", {
            type: "warning",
        });
        return { status: response.status, data: [] };
    } else {
        try {
            return { status: response.status, data: await response.json() };
        } catch {
            return { status: response.status, data: [] };
        }
    }
};

export const createService = async (body, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/service`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    return handleResponse(request, navigate);
};

export const listServices = async (navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/service`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(request, navigate);
};

export const listAllServices = async (navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/service/all`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(request, navigate);
};

export const updateService = async (body, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/service`, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    return handleResponse(request, navigate);
};

export const deleteService = async (id: string, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/service/${id}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(request, navigate);
};

