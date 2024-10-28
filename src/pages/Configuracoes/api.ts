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

export const useGetConfig = async () => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    return axios
        .get(`${import.meta.env.VITE_API_URL}/configs`, {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data);
};

export const updateConfigs = async (formData, navigate) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/configs`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
};

