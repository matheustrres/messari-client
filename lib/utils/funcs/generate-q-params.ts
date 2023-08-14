type QueryParameters<T> = {
	[key in keyof T]: string | number | undefined;
};

export const generateQParams = <T>(qParams: QueryParameters<T>): string => {
	return (
		Object.entries(qParams)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, value]) => value)
			.map(([key, value]) => `${key}=${value}`)
			.join('&')
	);
};
