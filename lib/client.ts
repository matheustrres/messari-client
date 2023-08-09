import {
	MessariAssetMarketData,
	MessariAssetMetrics,
	MessariAssetNews,
	MessariAssetWithMetrics,
	MessariAsset,
	QueryResult,
	MessariMarket,
	MessariAssetMarketDataWithAsset,
} from './typings';
import { PaginationOptions, buildAPIEndpoint } from './utils/funcs/endpoint';
import { removeDuplicatesFromArray } from './utils/funcs/remove-duplicates-from-array';
import { IRequest, Request } from './utils/request';

/**
 * All metrics available for search in the Messari api
 */
type AvailableMetrics =
	| 'all_time_high'
	| 'blockchain_stats_24_hours'
	| 'cycle_low'
	| 'developer_activity'
	| 'exchange_flows'
	| 'market_data_liquidity'
	| 'market_data'
	| 'marketcap'
	| 'miner_flows'
	| 'mining_stats'
	| 'misc_data'
	| 'on_chain_data'
	| 'reddit'
	| 'risk_metrics'
	| 'roi_data'
	| 'roi_by_year'
	| 'supply_activity'
	| 'supply_distribution'
	| 'supply'
	| 'token_sale_stats';

type AssetOptions = {
	metrics?: AvailableMetrics[];
};

/**
 * Represents the main MessariClient
 */
export class MessariClient {
	private readonly request: IRequest;

	static validate(apiKey: string): void {
		if (!apiKey) {
			throw new TypeError('An api key must be provided and be of type string');
		}
	}

	/**
	 * Creates a new MessariClient instance
	 *
	 * @param {String} messariApiKey - A valid Messari api key
	 * @param {IRequest} [request] - A request class that implements IRequest
	 * @see {@link https://curr.to/irequest-examples} to find out how to implement your own request class
	 * @see {@link https://messari.io/api/docs} to find out how to get a valid messari api key
	 */
	constructor(messariApiKey: string, request?: IRequest) {
		MessariClient.validate(messariApiKey);

		this.request = request || new Request(messariApiKey);
	}

	/**
	 * Get basic metadata for an asset.
	 *
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @param {AssetOptions} [options] - The asset's options to be loaded in the request
	 * @param {Array<String>} [options.metrics] - The asset's metrics to be loaded
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAsset<T = MessariAsset>(
		assetKey: string,
		options?: AssetOptions,
	): Promise<QueryResult<T>> {
		let endpoint: string;

		if (options?.metrics?.length) {
			const baseFields: string[] = [
				'id',
				'serial_id',
				'name',
				'slug',
				'symbol',
			];

			endpoint = `v1/assets/${assetKey}/metrics?fields=${baseFields.join(
				',',
			)},${removeDuplicatesFromArray<AvailableMetrics[]>(options.metrics)}`;
		} else {
			endpoint = `v1/assets/${assetKey}`;
		}

		const response = await this.request.get<T>(endpoint);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get all the quantitative metrics for an asset.
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAssetMetrics<T = MessariAssetMetrics>(
		assetKey: string,
	): Promise<QueryResult<T>> {
		const response = await this.request.get<T>(
			buildAPIEndpoint(`v1/assets/${assetKey}/metrics`),
		);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get the latest market-data for an asset. This data is also included in the
	 * `client.getAssetMetrics` method, but if all you need is market-data, use this.
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAssetMarketData<T = MessariAssetMarketData>(
		assetKey: string,
	): Promise<QueryResult<MessariAssetMarketDataWithAsset<T>>> {
		const response = await this.request.get<MessariAssetMarketDataWithAsset<T>>(
			buildAPIEndpoint(`v1/assets/${assetKey}/metrics/market-data`),
		);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get the list of all exchanges and pairs that are supported by Messari's market data API
	 *
	 * @returns {Promise<QueryResult<MessariMarket[]>>}
	 */
	public async getAllMarkets(): Promise<QueryResult<MessariMarket[]>> {
		const response = await this.request.get<MessariMarket[]>('v1/markets');

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get the paginated list of all assets and their metrics.
	 *
	 * @template {type} T
	 * @param {PaginationOptions} [paginationOptions] - The options to use for pagination
	 * @param {Number} [paginationOptions.page] - Page number to paginate, starts at 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned; default is 20 and max is 500 items
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssets<
		T extends Array<Record<string, any>> = MessariAssetWithMetrics[],
	>(paginationOptions?: PaginationOptions): Promise<QueryResult<T>> {
		const response = await this.request.get<T>(
			buildAPIEndpoint('v2/assets', paginationOptions),
		);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get the paginated list of latest news and analysis for all assets.
	 *
	 * @template {type} T
	 * @param {PaginationOptions} [paginationOptions] - The options to use for pagination
	 * @param {Number} [paginationOptions.page] - Page number to paginate, starts at 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned; default is 20 and max is 500 items
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssetsNews<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(paginationOptions?: PaginationOptions): Promise<QueryResult<T>> {
		const response = await this.request.get<T>(
			buildAPIEndpoint('v1/news', paginationOptions),
		);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	/**
	 * Get the paginated list of latest news and analysis for an asset.
	 *
	 * @template {type} T
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @param {PaginationOptions} [paginationOptions] - The options to use for pagination
	 * @param {Number} [paginationOptions.page] - Page number to paginate, starts at 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned; default is 20 and max is 500 items
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAssetNews<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(
		assetKey: string,
		paginationOptions?: PaginationOptions,
	): Promise<QueryResult<T>> {
		const response = await this.request.get<T>(
			buildAPIEndpoint(`v1/news/${assetKey}`, paginationOptions),
		);

		if (response.status.error_code && response.status.error_message) {
			return this.sendError(response);
		}

		return response;
	}

	private sendError(queryResult: QueryResult): QueryResult {
		return {
			status: {
				elapsed: queryResult.status.elapsed,
				timestamp: queryResult.status.timestamp,
				error_code: queryResult.status.error_code!,
				error_message: queryResult.status.error_message!,
			},
		};
	}
}
