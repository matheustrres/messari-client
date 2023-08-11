import { MockProxy, mock } from 'jest-mock-extended';

import { MessariClient } from '../lib/client';
import {
	MessariAsset,
	MessariAssetMetrics,
	MessariAssetNews,
	MessariMarket,
	QueryResult,
} from '../lib/typings';
import { IRequest } from '../lib/utils/request';
import messariApiErrorResponse from './fixtures/messari_api_error_response.json';
import messariApiGetAllMarketsResponse from './fixtures/messari_api_get_all_markets_response.json';
import messariApiGetAssetCustomResponse from './fixtures/messari_api_get_asset_custom_response.json';
import messariApiGetAssetResponse from './fixtures/messari_api_get_asset_response.json';
import messariApiListAllAssetsCustomResponse from './fixtures/messari_api_list_all_assets_custom_response.json';
import messariApilistNewsForAllAssetsCustomResponse from './fixtures/messari_api_list_all_assets_news_custom_response.json';
import messariApilistNewsForAllAssetsResponse from './fixtures/messari_api_list_all_assets_news_response.json';
import messariApiListAllAssetsResponse from './fixtures/messari_api_list_all_assets_response.json';
import messariApilistNewsForAssetCustomResponse from './fixtures/messari_api_list_asset_news_custom_response.json';
import messariApilistNewsForAssetResponse from './fixtures/messari_api_list_asset_news_response.json';

const apiKey = process.env.MESSARI_API_KEY as string;

describe('MessariClient', (): void => {
	let client: MessariClient;
	let mockedRequest: MockProxy<IRequest>;

	beforeAll((): void => {
		mockedRequest = mock();

		mockedRequest.get
			.mockResolvedValueOnce(messariApiGetAssetResponse)
			.mockResolvedValueOnce(messariApiGetAssetCustomResponse)
			.mockResolvedValueOnce(messariApiGetAllMarketsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsCustomResponse)
			.mockResolvedValueOnce(messariApilistNewsForAllAssetsResponse)
			.mockResolvedValueOnce(messariApilistNewsForAllAssetsCustomResponse)
			.mockResolvedValueOnce(messariApilistNewsForAssetResponse)
			.mockResolvedValueOnce(messariApilistNewsForAssetCustomResponse)
			.mockResolvedValue(messariApiErrorResponse);

		client = new MessariClient(apiKey, mockedRequest);
	});

	it('should be defined', (): void => {
		expect(client).toBeDefined();
	});

	describe('.getAsset', (): void => {
		it('should get basic metadata for an asset', async (): Promise<void> => {
			const response: QueryResult<MessariAsset> = await client.getAsset(
				'bitcoin',
			);

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				1,
				'v1/assets/bitcoin/metrics?fields=id,serial_id,name,slug,symbol,',
			);

			expect(response).toEqual(messariApiGetAssetResponse);
		});

		it('should get basic metadata and metrics for an asset [custom typing]', async (): Promise<void> => {
			type MyAssetType = MessariAsset & {
				supply: {
					y_2050: number | null;
					y_plus10: number | null;
					y_2050_percent_issued: number | null;
					supply_yplus_10: number | null;
					y_plus10_issued_percent: number | null;
					liquid: number | null;
					circulating: number | null;
					stock_to_flow: number | null;
				};
			};

			const response: QueryResult<MyAssetType> =
				await client.getAsset<MyAssetType>('bitcoin', {
					metrics: ['supply'],
				});

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				2,
				'v1/assets/bitcoin/metrics?fields=id,serial_id,name,slug,symbol,supply',
			);
			expect(response.data!.supply).toBeDefined();
			expect(response).toEqual(messariApiGetAssetCustomResponse);
		});
	});

	describe('.getAllMarkets', (): void => {
		it('should get ALL markets', async (): Promise<void> => {
			const response: QueryResult<MessariMarket[]> =
				await client.getAllMarkets();

			expect(mockedRequest.get).toHaveBeenNthCalledWith(3, 'v1/markets');

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(20);

			expect(response).toEqual(messariApiGetAllMarketsResponse);
		});
	});

	describe('.listAllAssets', (): void => {
		it('should get the list of ALL assets and their metrics', async (): Promise<void> => {
			const response: QueryResult<MessariAsset[]> = await client.listAllAssets<
				MessariAsset[]
			>();

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				4,
				'v2/assets?fields=id,serial_id,name,slug,symbol',
			);

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(20);

			for (const data of response.data!) {
				expect(data.id).toBeDefined();
				expect(data.name).toBeDefined();
				expect(data.serial_id).toBeDefined();
				expect(data.slug).toBeDefined();
				expect(data.symbol).toBeDefined();
			}

			expect(response).toEqual(messariApiListAllAssetsResponse);
		});

		it('should get the PAGINATED list of assets and their metrics [custom typing]', async (): Promise<void> => {
			type MyMetrics = MessariAssetMetrics<{
				mining_stats: {
					mining_algo: string | null;
					network_hash_rate: string | null;
					available_on_nicehash_percent: number | null;
					attack_appeal: number | null;
					hash_rate: number | null;
					hash_rate_30d_average: number | null;
					mining_revenue_native: number | null;
				};
				developer_activity: {
					stars: number | null;
					watchers: number | null;
					commits_last_3_months: number | null;
					commits_last_1_year: number | null;
					lines_added_last_3_months: number | null;
				};
			}>;

			const response: QueryResult<MyMetrics[]> = await client.listAllAssets<
				MyMetrics[]
			>(
				{
					metrics: ['mining_stats', 'developer_activity'],
				},
				{
					limit: 3,
					page: 1,
				},
			);

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				5,
				'v2/assets?fields=id,serial_id,name,slug,symbol,metrics/mining_stats,metrics/developer_activity&limit=3&page=1',
			);

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(3);

			for (const data of response.data!) {
				expect(data.metrics.mining_stats).toBeDefined();
				expect(data.metrics.developer_activity).toBeDefined();
			}

			expect(response).toEqual(messariApiListAllAssetsCustomResponse);
		});
	});

	describe('.listNewsForAllAssets', (): void => {
		it('should get the list of latest news and analysis for ALL assets', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listNewsForAllAssets();

			expect(mockedRequest.get).toHaveBeenNthCalledWith(6, 'v1/news');

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(20);

			expect(response).toEqual(messariApilistNewsForAllAssetsResponse);
		});

		it('should get the PAGINATED list of latest news and analysis for assets', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listNewsForAllAssets({
					limit: 2,
					page: 2,
				});

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				7,
				'v1/news?page=2&limit=2&sort=id',
			);

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(2);

			expect(response).toEqual(messariApilistNewsForAllAssetsCustomResponse);
		});
	});

	describe('.listNewsForAsset', (): void => {
		it('should get the list of latest news and analysis for A SINGLE asset', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listNewsForAsset('ethereum');

			expect(mockedRequest.get).toHaveBeenNthCalledWith(8, 'v1/news/ethereum');

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(20);

			expect(response).toEqual(messariApilistNewsForAssetResponse);
		});

		it('should get the PAGINATED list of latest news and analysis for A SINGLE asset', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listNewsForAsset('ethereum', {
					limit: 2,
				});

			expect(mockedRequest.get).toHaveBeenNthCalledWith(
				9,
				'v1/news/ethereum?page=1&limit=2&sort=id',
			);

			expect(response.data).toBeDefined();
			expect(response.data!.length).toBe(2);

			expect(response).toEqual(messariApilistNewsForAssetCustomResponse);
		});
	});

	it('should fail when searching for an invalid asset', async (): Promise<void> => {
		const promises = [
			client.getAsset('fake-asset-name'),
			client.listNewsForAsset('fake-asset-name'),
		];

		const results: QueryResult[] = await Promise.all(promises);

		for (const result of results) {
			expect(result.status.error_code).toBe(404);
			expect(result.status.error_message).toBe('Not Found');
		}
	});
});
