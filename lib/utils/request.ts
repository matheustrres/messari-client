import { QueryResult } from '../typings';

type RequestConfigProps = {
	messariApiKey: string;
};

export class Request {
	constructor(private config: RequestConfigProps) {}

	public async get<T>(endpoint: string): Promise<QueryResult<T>> {
		const res = await fetch(
			new URL(`https://data.messari.io/api/${endpoint}`),
			{
				method: 'GET',
				headers: {
					'x-messari-api-key': this.config.messariApiKey,
				},
			},
		);

		const json = (await res.json()) as QueryResult<T>;

		return json;
	}
}
