import { getRequestErrorMessage } from '../constraints/errors';
import { QueryResult } from '../typings';
import { MessariError } from './errors/messari.error';

type RequestConfigProps = {
	messariApiKey: string;
};

export class Request {
	constructor(private config: RequestConfigProps) {}

	public async get<T extends QueryResult>(
		endpoint: string,
	): Promise<T | MessariError> {
		const res = await fetch(
			new URL(`https://data.messari.io/api/${endpoint}`),
			{
				method: 'GET',
				headers: {
					'x-messari-api-key': this.config.messariApiKey,
				},
			},
		);

		const resObj = (await res.json()) as T;

		if (resObj.status.error_code) {
			const errorMessage: string = getRequestErrorMessage(
				resObj.status.error_code,
			);

			return new MessariError(
				errorMessage,
				resObj.status.error_code,
				resObj.status.timestamp,
			);
		}

		return resObj;
	}
}
