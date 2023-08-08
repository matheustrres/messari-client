import { MessariAsset } from '../lib/typings';
import { Request } from '../lib/utils/request';
import messariApiGetAssetResponse from './fixtures/messari_api_get_asset_response.json';

const apiKey = process.env.MESSARI_API_KEY as string;

const mockFetchResponse = <T>(response: T): jest.Mock =>
	jest.fn().mockImplementation(async () => {
		return {
			json: async (): Promise<T> => response,
		};
	});

describe('Request HTTP/client', (): void => {
	let request: Request;

	afterAll((): void => {
		jest.clearAllMocks();
	});

	beforeAll((): void => {
		request = new Request(apiKey);
	});

	describe('X GET', (): void => {
		it('should call GET with correct parameters', async (): Promise<void> => {
			global.fetch = mockFetchResponse(messariApiGetAssetResponse);

			await request.get<MessariAsset>('v1/assets/bitcoin');

			expect(global.fetch).toHaveBeenCalledWith(
				new URL(`https://data.messari.io/api/v1/assets/bitcoin`),
				{
					method: 'GET',
					headers: {
						'x-messari-api-key': apiKey,
					},
				},
			);
		});
	});
});
