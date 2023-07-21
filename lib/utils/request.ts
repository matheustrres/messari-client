import { QueryResult } from 'lib/typings';
import undici, { Dispatcher } from 'undici';

import { getRequestErrorMessage } from '../constraints/errors';
import { MessariError } from './errors/messari/messari.error';

type RequestConfigProps = {
	messariHeaderApiKey: string;
};

export class Request {
	private request: typeof undici.request;

	constructor(private config: RequestConfigProps) {
		this.request = undici.request;
	}

	public async get<T>(endpoint: string): Promise<T | MessariError> {
		const res = await this.request(`https://data.messari.io/api/${endpoint}`, {
			method: 'GET',
			headers: {
				'x-messari-api-key': this.config.messariHeaderApiKey,
			},
		}).then((val: Dispatcher.ResponseData) => val.body.json());

		if ((res as QueryResult).status.error_code) {
			const messariError = res as QueryResult;
			const errorMessage: string = getRequestErrorMessage(
				messariError.status.error_code,
			);

			return new MessariError(
				errorMessage,
				messariError.status.error_code,
				messariError.status.timestamp,
			);
		}

		return res as T;
	}
}
