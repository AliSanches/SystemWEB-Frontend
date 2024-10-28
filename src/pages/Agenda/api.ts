import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { TNovaTarefa, TTarefa } from "./Types";

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

export const listarPorData = async (navigate: NavigateFunction, data: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/calendario/listar-por-data?data=${data}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const criarTarefa = async (navigate: NavigateFunction, tarefa: TNovaTarefa) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/calendario/tarefa`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarefa),
    });

    return handleResponse(response, navigate);
};

export const editarTarefa = async (navigate: NavigateFunction, tarefa: TTarefa) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/calendario/tarefa`, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarefa),
    });

    return handleResponse(response, navigate);
};

export const deletarTarefa = async (navigate: NavigateFunction, id: number) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/calendario/tarefa/${id}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

