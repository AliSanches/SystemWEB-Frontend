import axios from "axios";

export const getDataGED = async () => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/ged/get/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data.getGed;
        });
};

export const getFilterPasta = async (id: string) => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/ged/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data.ged;
        });
};

export const getPorcentagemUsoGed = async () => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/ged/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data;
        });
};

export const getPastas = async (search: string) => {
    const { token } = await JSON.parse(localStorage.getItem("user")!).state;
    return axios
        .get(`${import.meta.env.VITE_API_URL}/ged/get/pasta?&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data.getPastas;
        });
};

export const createPasta = async (data: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    return axios.post(
        `${import.meta.env.VITE_API_URL}/ged/create/pasta`,
        { data },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const deleteFolder = async (id: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    return axios.delete(`${import.meta.env.VITE_API_URL}/ged/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useUpload = async (files: any[], descricao: string, categoria: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("description", descricao);
    formData.append("categoria", categoria);

    return axios.post(`${import.meta.env.VITE_API_URL}/ged/file`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useDeleteFile = async (fileId: number) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;

    return axios.delete(`${import.meta.env.VITE_API_URL}/ged/file/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useRenameFile = async (fileId: number, description: string) => {
    const user = await JSON.parse(localStorage.getItem("user")!).state;
    const token = user.token;
    const body = JSON.stringify({ description });

    return axios.put(`${import.meta.env.VITE_API_URL}/ged/file/${fileId}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};

