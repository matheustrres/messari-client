import {
	MessariAssetNews,
	MessariAsset,
	QueryResult,
	MessariMarket,
	AssetOptions,
	AvailableMetrics,
} from './typings';
import { PaginationOptions, buildAPIEndpoint } from './utils/funcs/endpoint';
import { generateQParams } from './utils/funcs/paginate';
import { removeDuplicatesFromArray } from './utils/funcs/remove-duplicates-from-array';
import { IRequest, Request } from './utils/request';

/**
 * Represents the main MessariClient
 */
export class MessariClient {
	private readonly request: IRequest;
	private static readonly BASE_ASSET_FIELDS: string =
		'id,serial_id,name,slug,symbol';

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
	 * @param {AssetOptions} [assetOptions] - The asset's options to be loaded in the request
	 * @param {Array<String>} [assetOptions.metrics] - The asset's metrics to be loaded
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAsset<T extends MessariAsset = MessariAsset>(
		assetKey: string,
		assetOptions?: AssetOptions,
	): Promise<QueryResult<T>> {
		let endpoint: string = `v1/assets/${assetKey}/metrics?fields=${MessariClient.BASE_ASSET_FIELDS},`;

		if (assetOptions?.metrics?.length)
			endpoint += assetOptions.metrics.join(',');

		return this.fetchAPIData<T>(endpoint);
	}

	/**
	 * Get the list of all exchanges and pairs that are supported by Messari's market data API
	 *
	 * @returns {Promise<QueryResult<MessariMarket[]>>}
	 */
	public async getAllMarkets(): Promise<QueryResult<MessariMarket[]>> {
		return this.fetchAPIData<MessariMarket[]>('v1/markets');
	}

	/**
	 * Get the paginated list of all assets and their metrics.
	 *
	 * @template {type} T
	 * @param {AssetOptions} [assetOptions] - The asset's options to be loaded in the request
	 * @param {Array<String>} [assetOptions.metrics] - The asset's metrics to be loaded
	 * @param {PaginationOptions} [paginationOptions] - The options to use for pagination
	 * @param {Number} [paginationOptions.page] - Page number to paginate, starts at 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned; default is 20 and max is 500 items
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssets<T extends MessariAsset[] = MessariAsset[]>(
		assetOptions?: AssetOptions,
		paginationOptions?: PaginationOptions,
	): Promise<QueryResult<T>> {
		let endpoint: string = `v2/assets?fields=${MessariClient.BASE_ASSET_FIELDS}`;

		if (assetOptions?.metrics?.length) {
			const metricsQParams: string =
				removeDuplicatesFromArray<AvailableMetrics>(assetOptions.metrics)
					.map((metric: AvailableMetrics): string => `metrics/${metric}`)
					.join(',');

			endpoint += `,${metricsQParams}`;
		}

		if (paginationOptions)
			endpoint += `&${generateQParams<PaginationOptions>(paginationOptions)}`;

		return this.fetchAPIData<T>(endpoint);
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
	public async listNewsForAllAssets<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(paginationOptions?: PaginationOptions): Promise<QueryResult<T>> {
		return this.fetchAPIData<T>(buildAPIEndpoint('v1/news', paginationOptions));
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
	public async listNewsForAsset<
		T extends Array<Record<string, any>> = MessariAssetNews[],
	>(
		assetKey: string,
		paginationOptions?: PaginationOptions,
	): Promise<QueryResult<T>> {
		return this.fetchAPIData<T>(
			buildAPIEndpoint(`v1/news/${assetKey}`, paginationOptions),
		);
	}

	private async fetchAPIData<T>(endpoint: string): Promise<QueryResult<T>> {
		return this.request.get<T>(endpoint);
	}
}
