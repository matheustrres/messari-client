import {
	MessariAssetMarketData,
	MessariAssetMetrics,
	MessariAssetNews,
	MessariAssetWithMetrics,
	MessariAsset,
	QueryResult,
} from './typings';
import { MessariError } from './utils/errors/messari.error';
import { PaginationOptions, buildAPIEndpoint } from './utils/funcs/endpoint';
import { Request } from './utils/request';

type MessariClientProps = {
	key: string;
};

/**
 * Represents the main MessariClient
 */
export class MessariClient {
	private request: Request;

	static validate(apiKey: string): void {
		if (!apiKey) {
			throw new TypeError('An api key must be provided and be of type string');
		}
	}

	/**
	 * Creates a new MessariClient instance
	 *
	 * @param {String} props.messariApiKey - A valid Messari api key
	 */
	constructor(props: MessariClientProps) {
		MessariClient.validate(props.key);

		this.request = new Request({
			messariApiKey: props.key,
		});
	}

	/**
	 * Get the basic metadata for an asset
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAsset<T = MessariAsset>(
		assetKey: string,
	): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint(`v1/assets/${assetKey}`),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	/**
	 * Get the quantitative metrics for an asset
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAssetMetrics<T = MessariAssetMetrics>(
		assetKey: string,
	): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint(`v1/assets/${assetKey}/metrics`),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	/**
	 * Get the market data for an asset
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAssetMarketData<T = MessariAssetMarketData>(
		assetKey: string,
	): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint(`v1/assets/${assetKey}/metrics/market-data`),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	/**
	 * Get the list of all assets and their metrics
	 *
	 * @template {type} T
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssets<
		T extends Array<Record<string, any>> = MessariAssetWithMetrics[],
	>(paginationOptions?: PaginationOptions): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint('v2/assets', paginationOptions),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	/**
	 * Get the latest news and analysis for all assets
	 *
	 * @template {type} T
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssetsNews<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(paginationOptions?: PaginationOptions): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint('v1/news', paginationOptions),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	/**
	 * Get the latest news and analysis for an asset
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAssetNews<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(assetKey: string): Promise<QueryResult<T>> {
		const response = await this.request.get<QueryResult<T>>(
			buildAPIEndpoint(`v1/news/${assetKey}`),
		);

		if (response instanceof MessariError) {
			return this.sendErrorResponse(response);
		}

		return {
			status: {
				timestamp: new Date().toISOString(),
			},
			data: response.data,
		};
	}

	private sendErrorResponse(error: MessariError): QueryResult {
		return {
			status: {
				timestamp: error.timestamp,
				error_code: error.code,
				error_message: error.message,
			},
		};
	}
}
