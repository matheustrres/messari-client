import { QueryResult } from '../typings';

/**
 * Base interface for a request class to extend, in case you'd like
 * to use a request class of your own on the client.
 *
 * @interface IRequest
 * @see {@link https://curr.to/irequest-examples}
 */
export interface IRequest {
	get: <T>(endpoint: string) => Promise<QueryResult<T>>;
}

export class Request implements IRequest {
	constructor(private readonly messariApiKey: string) {}

	public async get<T>(endpoint: string): Promise<QueryResult<T>> {
		const res = await fetch(
			new URL(`https://data.messari.io/api/${endpoint}`),
			{
				method: 'GET',
				headers: {
					'x-messari-api-key': this.messariApiKey,
				},
			},
		);

		const json = (await res.json()) as QueryResult<T>;

		return json;
	}
}
