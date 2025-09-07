export const validateRequired = (title: string) => {
	return (value: string) => {
		if (!value) {
			return `${title} is required`;
		}

		if (value.length < 3) {
			return `${title} needs to be 3 characters or more`;
		}
		return true;
	};
};