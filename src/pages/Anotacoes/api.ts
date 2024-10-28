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

export const listaAnotacoes = async (search: string, skip: number, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/anotacoes/lista-anotacoes?skip=${skip}&search=${search}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response, navigate);
};

export const listaCategorias = async (search: string, skip, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria?search=${search}&skip=${skip}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const getSubcategoriaPorCategoria = async (id: number, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/${id}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const listaSubcategoriasId = async (id: string, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria/${id}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const listaSubcategorias = async (navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const listQtdAnotacaoPorSubcategoria = async (id: string, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria/anotacao/${id}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const listaCategoriasSelect = async (search: string, skip, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/anotacoes/categoria?search=${search}&skip=${skip}&all=true`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response, navigate);
};

export const editaCategoria = async (id: string, data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/${id}`, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response, navigate);
};

export const editaSubcategoria = async (id: string, data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria/${id}`, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response, navigate);
};

export const criaCategoria = async (data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response, navigate);
};

export const criaSubcategoria = async (data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleResponse(response, navigate);
};

export const deletaAnotacao = async (id: number, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/${id}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const deletaCategoria = async (id: number, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/${id}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const deletaSubcategoria = async (id: number, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/categoria/subcategoria/${id}`, {
        method: "DELETE",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const updateAnotacao = async (data, id, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/anotacao/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const getAnotacao = async (id, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/get-anotacao/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const criaAnotacao = async (data, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/anotacoes/anotacao`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

