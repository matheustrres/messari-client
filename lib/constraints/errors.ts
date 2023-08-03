type ObjectValues<T> = T[keyof T];

export const MessariRequestErrors = {
	SUCCESSFUL: 'Request succeeded',
	BAD_REQUEST: 'Bad request',
	UNAUTHORIZED: 'Unauthorized (authentication)',
	FORBIDDEN: 'Forbidden (authorization)',
	NOT_FOUND: 'Asset not found',
	TOO_MANY_REQUESTS: 'Too many requests (rate limit)',
	INTERNAL_SERVER_ERROR: 'An Internal server error occurred',
} as const;

type MessariRequestErrors = ObjectValues<typeof MessariRequestErrors>;

export const getRequestErrorMessage = (code: number): string => {
	const errorCodes = {
		200: MessariRequestErrors.SUCCESSFUL,
		400: MessariRequestErrors.BAD_REQUEST,
		401: MessariRequestErrors.UNAUTHORIZED,
		403: MessariRequestErrors.FORBIDDEN,
		404: MessariRequestErrors.NOT_FOUND,
		429: MessariRequestErrors.TOO_MANY_REQUESTS,
		500: MessariRequestErrors.INTERNAL_SERVER_ERROR,
	};

	return errorCodes[code] || 'Unknown error';
};
