import { MockProxy, mock } from 'jest-mock-extended';

import { MessariClient } from '../lib/client';
import {
	MessariAsset,
	MessariAssetMetrics,
	MessariAssetNews,
	MessariAssetWithMetrics,
	MessariMarket,
	QueryResult,
} from '../lib/typings';
import { IRequest } from '../lib/utils/request';
import messariApiErrorResponse from './fixtures/messari_api_error_response.json';
import messariApiGetAllMarketsResponse from './fixtures/messari_api_get_all_markets_response.json';
import messariApiGetAssetCustomResponse from './fixtures/messari_api_get_asset_custom_response.json';
import messariApiGetAssetWithMetricsResponse from './fixtures/messari_api_get_asset_with_metrics_response.json';
import messariApiListAllAssetsCustomResponse from './fixtures/messari_api_list_all_assets_custom_response.json';
import messariApiListAllAssetsNewsResponse from './fixtures/messari_api_list_all_assets_news_response.json';
import messariApiListAllAssetsResponse from './fixtures/messari_api_list_all_assets_response.json';
import messariApiListAssetNewsResponse from './fixtures/messari_api_list_asset_news_response.json';

const apiKey = process.env.MESSARI_API_KEY as string;

describe('MessariClient', (): void => {
	let client: MessariClient;
	let mockedRequest: MockProxy<IRequest>;

	beforeAll((): void => {
		mockedRequest = mock();

		mockedRequest.get
			.mockResolvedValueOnce(messariApiGetAssetWithMetricsResponse)
			.mockResolvedValueOnce(messariApiGetAssetCustomResponse)
			.mockResolvedValueOnce(messariApiGetAllMarketsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsCustomResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsNewsResponse)
			.mockResolvedValueOnce(messariApiListAssetNewsResponse)
			.mockResolvedValue(messariApiErrorResponse);

		client = new MessariClient(apiKey, mockedRequest);
	});

	it('should be defined', (): void => {
		expect(client).toBeDefined();
	});

	describe('.getAsset', (): void => {
		it('should load the basic metadata and metrics for an asset', async (): Promise<void> => {
			const response: QueryResult<MessariAssetWithMetrics> =
				await client.getAsset<MessariAssetWithMetrics>('bitcoin', {
					metrics: ['all_time_high', 'market_data'],
				});

			expect(response.data).toBeDefined();
			expect(response.data!.id).toBeDefined();
			expect(response.data!.all_time_high).toBeDefined();
			expect(response.data!.market_data).toBeDefined();
			expect(response).toEqual(messariApiGetAssetWithMetricsResponse);
		});

		it('should load the metrics of an asset with my own typing', async (): Promise<void> => {
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

			expect(response.data).toBeDefined();
			expect(response.data!.id).toBeDefined();
			expect(response.data!.supply).toBeDefined();
			expect(response).toEqual(messariApiGetAssetCustomResponse);
		});
	});

	describe('.getAllMarkets', (): void => {
		it('should get all markets', async (): Promise<void> => {
			const response: QueryResult<MessariMarket[]> =
				await client.getAllMarkets();

			expect(response).toEqual(messariApiGetAllMarketsResponse);
		});
	});

	describe('.listAllAssets', (): void => {
		it('should get the paginated list of all assets and their metrics', async (): Promise<void> => {
			const response: QueryResult<MessariAssetMetrics[]> =
				await client.listAllAssets(
					{
						metrics: ['all_time_high', 'market_data'],
					},
					{
						limit: 3,
						page: 1,
					},
				);

			expect(response.data).toBeDefined();

			for (const data of response.data!) {
				expect(data.metrics.all_time_high).toBeDefined();
				expect(data.metrics.market_data).toBeDefined();
			}

			expect(response).toEqual(messariApiListAllAssetsResponse);
		});

		it('should get the paginated list of 3 assets and their metrics with my own typing', async (): Promise<void> => {
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

			const response = await client.listAllAssets<MyMetrics[]>(
				{
					metrics: ['mining_stats', 'developer_activity'],
				},
				{
					limit: 3,
					page: 1,
				},
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

	describe('.listAllAssetsNews', (): void => {
		it('should get the paginated list of latest news and analysis for all assets', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listAllAssetsNews({
					limit: 2,
					page: 2,
				});

			expect(response).toEqual(messariApiListAllAssetsNewsResponse);
		});
	});

	describe('.listAssetNews', (): void => {
		it('should get the paginated list of latest news and analysis for an asset', async (): Promise<void> => {
			const response: QueryResult<MessariAssetNews[]> =
				await client.listAssetNews('ethereum', {
					limit: 2,
				});

			expect(response).toEqual(messariApiListAssetNewsResponse);
		});
	});

	it('should fail when searching for an invalid asset', async (): Promise<void> => {
		const promises = [
			client.getAsset('fake-asset-name'),
			client.listAssetNews('fake-asset-name'),
		];

		const results: QueryResult[] = await Promise.all(promises);

		for (const result of results) {
			expect(result.status.error_code).toBe(404);
			expect(result.status.error_message).toBe('Not Found');
		}
	});
});
