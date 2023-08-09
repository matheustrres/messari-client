import { MockProxy, mock } from 'jest-mock-extended';

import { MessariClient } from '../lib/client';
import {
	MessariAsset,
	MessariAssetNews,
	MessariAssetWithMetrics,
	QueryResult,
} from '../lib/typings';
import { IRequest } from '../lib/utils/request';
import messariApiErrorResponse from './fixtures/messari_api_error_response.json';
import messariApiGetAllMarketsResponse from './fixtures/messari_api_get_all_markets_response.json';
import messariApiGetAssetResponse from './fixtures/messari_api_get_asset_response.json';
import messariApiGetAssetWithMetricsResponse from './fixtures/messari_api_get_asset_with_metrics_response.json';
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
			.mockResolvedValueOnce(messariApiGetAssetResponse)
			.mockResolvedValueOnce(messariApiGetAssetWithMetricsResponse)
			.mockResolvedValueOnce(messariApiGetAllMarketsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsResponse)
			.mockResolvedValueOnce(messariApiListAllAssetsNewsResponse)
			.mockResolvedValueOnce(messariApiListAssetNewsResponse)
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

			expect(response).toEqual(messariApiGetAssetResponse);
		});

		it('should load the metrics of an asset', async (): Promise<void> => {
			const response: QueryResult<MessariAsset> = await client.getAsset(
				'bitcoin',
				{
					metrics: ['all_time_high', 'market_data'],
				},
			);

			expect(response).toEqual(messariApiGetAssetWithMetricsResponse);
			expect(response.data?.all_time_high).toBeDefined();
			expect(response.data?.market_data).toBeDefined();
			expect(response.data?.marketcap).toBe(undefined);
			expect(response.data?.reddit).toBe(undefined);
			expect(response.data?.roi_data).toBe(undefined);
		});
	});

	describe('.getAllMarkets', (): void => {
		it('should get all markets', async (): Promise<void> => {
			const response = await client.getAllMarkets();

			expect(response).toEqual(messariApiGetAllMarketsResponse);
		});
	});

	describe('.listAllAssets', (): void => {
		it('should get the paginated list of all assets and their metrics', async (): Promise<void> => {
			const response: QueryResult<MessariAssetWithMetrics[]> =
				await client.listAllAssets({
					limit: 5,
					page: 2,
				});

			expect(response).toEqual(messariApiListAllAssetsResponse);
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
