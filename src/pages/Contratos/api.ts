import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

export const create = async (data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/contrato/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const listContratos = async () => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/contrato/`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getById = async (id, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/contrato/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const updateContrato = async (id, data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/contrato/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const deleteOne = async (id, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/contrato/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

