export type PaginationOptions = {
	page?: number;
	limit?: number;
};

const formatLimit = (limit: number): number => {
	const DEFAULT_LIMIT = 20;
	const MAX_LIMIT = 500;

	if (limit < 0) limit = DEFAULT_LIMIT;
	if (limit > MAX_LIMIT) limit = MAX_LIMIT;

	return limit;
};

const formatPageNumber = (pageNumber: number): number =>
	pageNumber < 0 ? 1 : pageNumber;

export const buildAPIEndpoint = (
	endpoint: string,
	pgtOptions?: PaginationOptions | never,
): string => {
	const qParams: string[] = [];

	if (pgtOptions?.page)
		qParams.push(`page=${formatPageNumber(pgtOptions?.page)}`);
	if (pgtOptions?.limit)
		qParams.push(`limit=${formatLimit(pgtOptions?.limit)}`);

	if (qParams.length) {
		endpoint += `?${qParams.join('&')}`;
	}

	return endpoint;
};
