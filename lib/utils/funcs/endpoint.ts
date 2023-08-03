import { generateQParams } from './paginate';

export type PaginationOptions = {
	page?: number;
	limit?: number;
	sort?: 'id'; // | 'marketcap desc'
};

export const buildAPIEndpoint = (
	endpoint: string,
	paginationOptions?: PaginationOptions | never,
): string => {
	if (paginationOptions) {
		const qParams: string = generateQParams<PaginationOptions>({
			page: 1,
			limit: 20,
			sort: 'id',
			...paginationOptions,
		});

		return `${endpoint}?${qParams}`;
	}

	return endpoint;
};
