import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

const handleResponse = async (response: Response, navigate: NavigateFunction) => {
    if (response.status === 401) {
        navigate("/");
        toast("Sessão encerrada!", {
            type: "warning",
        });
        return { status: response.status, data: [] };
    } else return { status: response.status, data: await response.json() };
};

type Customer = {
    name: string;
    gender: string;
    birthdate: string;
    motherName: string;
    cpf: string;
    rg: string;
    rgIssuer: string;
    cep: string;
    uf: string;
    city: string;
    neighborhood: string;
    street: string;
    mail: string;
    phone: string;
    birthplace: string;
    profession: string;
    civil: string;
    customerSince: string;
    serie: string;
    ctps: string;
    numberFolder: string;
    pis: string;
    responsibleFolder: string;
    smartPhone: string;
    statusCustomer: string;
    origin: string;
    stateLife: string;
    education: string;
    payment: boolean;
    passwordINSS: string;
    imageProfile: string;
};

export const createCustomer = async (body: Customer, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/create`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    return handleResponse(response, navigate);
};

export const listCustomers = async (number: number, search: string, navigate: NavigateFunction) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/list?number=${number}&search=${search}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, navigate);
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

