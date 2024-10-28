import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { notify } from "../components/notify";

const url = `${import.meta.env.VITE_API_URL}/user/authenticate`;

const useUserStore = create(
	persist(
		(set, get) => ({
			name: null,
			email: null,
			token: null,
			id: null,
			empresa: null,
			permissions: null,
			contacts: null,
			googleToken: null,
			googleRefreshToken: null,

			authenticate: async (data, navigate, setLoading) => {
				setLoading(true);
				try {
					let response = await fetch(url, {
						method: "POST",
						headers: {
							accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					});

					if (response.status === 200) {
						let json = await response.json();
						set({
							name: json.name,
							email: json.email,
							token: json.token,
							id: json.id,
							empresa: json.empresa,
							permissions: json.permissions,
							contacts: json.contacts,
							googleToken: json.google_token,
							googleRefreshToken: json.google_refreshToken,
						});
						navigate("/app/dashboard");
					} else {
						setLoading(false);
						notify("Credenciais inválidas", "error");
					}
				} catch {
					setLoading(false);
					notify("Serviço indisponível", "warning");
				}
			},

			logout: (navigate) => {
				set({
					name: null,
					email: null,
					token: null,
					id: null,
					empresa: null,
					permissions: null,
				});
				navigate("/");
			},

			updateConfigs: (empresa) => {
				set({
					empresa: empresa,
				});
			},
			setTokens: (token, refresh) => {
				set({
					googleToken: token,
					googleRefreshToken: refresh,
				});
			},
		}),
		{
			name: "user", // unique name
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		}
	)
);

export default useUserStore;

