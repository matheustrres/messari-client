export const SUCCESSFUL_REQUEST = 'Request succeeded';
export const INVALID_PARAM_CONSTRAINT = 'Invalid param value given';
export const UNAUTHORIZED_CONSTRAINT = 'Unauthorized (authentication)';
export const FORBIDDEN_CONSTRAINT = 'Forbidden (authorization)';
export const NOT_FOUND_CONSTRAINT = 'Asset not found';
export const RATE_LIMIT_CONSTRAINT = 'Too many requests (rate limit)';
export const INTERNAL_SERVER_ERROR_CONSTRAINT =
	'An Internal server error occurred';

export const getRequestErrorMessage = (code: number): string => {
	const errorCodes = {
		400: INVALID_PARAM_CONSTRAINT,
		401: UNAUTHORIZED_CONSTRAINT,
		403: FORBIDDEN_CONSTRAINT,
		404: NOT_FOUND_CONSTRAINT,
		429: RATE_LIMIT_CONSTRAINT,
		500: INTERNAL_SERVER_ERROR_CONSTRAINT,
	};

	return errorCodes[code];
};
