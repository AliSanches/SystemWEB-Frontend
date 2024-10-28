export const getToday = () => {
	let today: Date | string = new Date();
	today = today.toISOString().split("T")[0];
	return today;
};
