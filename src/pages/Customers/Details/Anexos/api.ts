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

export const getCustomer = async (id: string, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/get/${id}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

export const useUpload = async (customerId: string, files: any[], descricao: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("description", descricao);

    return axios.post(`${import.meta.env.VITE_API_URL}/customer/${customerId}/file`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useDeleteFile = async (fileId: number) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    return axios.delete(`${import.meta.env.VITE_API_URL}/customer/file/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useRenameFile = async (fileId: number, description: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;
    const body = JSON.stringify({ description });

    return axios.put(`${import.meta.env.VITE_API_URL}/customer/file/${fileId}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};

export const useGetCustomer = async (id: string) => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/customer/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data;
        });
};

export const useGetCustomerFiles = async (id: string) => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/customer/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data.attachments;
        });
};

