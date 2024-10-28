import { toast, Bounce } from "react-toastify";

export const notify = (text, type) => {
	toast(text, {
		type,
		position: "top-center",
		transition: Bounce,
	});
};
