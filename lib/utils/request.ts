import undici from 'undici';

import { getRequestErrorMessage } from '../constraints/errors';
import { QueryResult } from '../typings';
import { MessariError } from './errors/messari.error';

type RequestConfigProps = {
	messariHeaderApiKey: string;
};

export class Request {
	private request: typeof undici.request;

	constructor(private config: RequestConfigProps) {
		this.request = undici.request;
	}

	public async get<T extends QueryResult>(
		endpoint: string,
	): Promise<T | MessariError> {
		const res = await this.request(`https://data.messari.io/api/${endpoint}`, {
			method: 'GET',
			headers: {
				'x-messari-api-key': this.config.messariHeaderApiKey,
			},
		});

		const resObj = (await res.body.json()) as T;

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
