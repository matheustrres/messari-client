import {
	MessariAssetNews,
	MessariAsset,
	QueryResult,
	MessariMarket,
	MessariAPIAssetOptions,
	MessariAPIAvailableKeyMetrics,
	MessariAPIPaginationOptions,
} from './typings';
import { generateQParams } from './utils/funcs/generate-q-params';
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
	 * Create a new MessariClient instance
	 *
	 * @param {String} messariApiKey - A valid Messari API key
	 * @param {IRequest} [request] - A request class that implements IRequest
	 * @see {@link https://curr.to/irequest-examples} to find out how to implement your own request class
	 * @see {@link https://messari.io/api/docs} to find out how to get a valid Messari API key
	 */
	constructor(messariApiKey: string, request?: IRequest) {
		MessariClient.validate(messariApiKey);

		this.request = request || new Request(messariApiKey);
	}

	/**
	 * Get basic metadata and metrics for an asset
	 *
	 * @template {type} T
	 * @param {string} assetKey The asset's ID, slug or symbol
	 * @param {MessariAPIAssetOptions} [assetOptions] - The API asset's options for the request
	 * @param {Array<String>} [assetOptions.metrics] - The asset's metrics to be loaded
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async getAsset<T extends MessariAsset = MessariAsset>(
		assetKey: string,
		assetOptions?: MessariAPIAssetOptions,
	): Promise<QueryResult<T>> {
		let endpoint: string = `v1/assets/${assetKey}/metrics?fields=${MessariClient.BASE_ASSET_FIELDS}`;

		if (assetOptions?.metrics?.length)
			endpoint += `,${assetOptions.metrics.join(',')}`;

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
	 * Get the list of all assets and their metrics
	 *
	 * @template {type} T
	 * @param {MessariAPIAssetOptions} [assetOptions] - The API assets' options for the request
	 * @param {Array<String>} [assetOptions.metrics] - The assets' metrics to be loaded
	 * @param {MessariAPIPaginationOptions} [paginationOptions] - The API options for pagination
	 * @param {Number} [paginationOptions.page] - The start page for pagination, defaults to 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned, default is 20 and max is 500
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listAllAssets<T extends MessariAsset[] = MessariAsset[]>(
		assetOptions?: MessariAPIAssetOptions,
		paginationOptions?: MessariAPIPaginationOptions,
	): Promise<QueryResult<T>> {
		let endpoint: string = `v2/assets?fields=${MessariClient.BASE_ASSET_FIELDS}`;

		if (assetOptions?.metrics?.length) {
			const metricsQParams: string =
				removeDuplicatesFromArray<MessariAPIAvailableKeyMetrics>(
					assetOptions.metrics,
				)
					.map((metric) => `metrics/${metric}`)
					.join(',');

			endpoint += `,${metricsQParams}`;
		}

		if (paginationOptions)
			endpoint += `&${generateQParams<MessariAPIPaginationOptions>(
				paginationOptions,
			)}`;

		return this.fetchAPIData<T>(endpoint);
	}

	/**
	 * List all the latest news and analysis for all assets
	 *
	 * @param {MessariAPIPaginationOptions} [paginationOptions] - The API options for pagination
	 * @param {Number} [paginationOptions.page] - The start page for pagination, defaults to 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned, default is 20 and max is 500
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listNewsForAllAssets(
		paginationOptions?: MessariAPIPaginationOptions,
	): Promise<QueryResult<MessariAssetNews[]>> {
		let endpoint: string = 'v1/news';

		if (paginationOptions) {
			const qParams: string =
				generateQParams<MessariAPIPaginationOptions>(paginationOptions);

			endpoint += `?${qParams}`;
		}

		return this.fetchAPIData<MessariAssetNews[]>(endpoint);
	}

	/**
	 * List all the latest news and analysis for an asset
	 *
	 * @param {string} assetKey - The asset's ID, slug or symbol
	 * @param {MessariAPIPaginationOptions} [paginationOptions] - The API options for pagination
	 * @param {Number} [paginationOptions.page] - The start page for pagination, defaults to 1
	 * @param {Number} [paginationOptions.limit] - The limit number of items to be returned, default is 20 and max is 500
	 * @returns {Promise<QueryResult<T>>}
	 */
	public async listNewsForAsset(
		assetKey: string,
		paginationOptions?: MessariAPIPaginationOptions,
	): Promise<QueryResult<MessariAssetNews[]>> {
		let endpoint: string = `v1/news/${assetKey}`;

		if (paginationOptions) {
			const qParams: string =
				generateQParams<MessariAPIPaginationOptions>(paginationOptions);

			endpoint += `?${qParams}`;
		}

		return this.fetchAPIData<MessariAssetNews[]>(endpoint);
	}

	private async fetchAPIData<T>(endpoint: string): Promise<QueryResult<T>> {
		return this.request.get<T>(endpoint);
	}
}
