import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { light, dark } from "../assets/colors";

const useDarkMode = create(
	persist(
		(set, get) => ({
			colors: light,
			toggleDarkMode: () => {
				let colors = get().colors;
				if (colors === light) colors = dark;
				else colors = light;
				set({ colors });
			},
		}),
		{
			name: "global-theme",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useDarkMode;

