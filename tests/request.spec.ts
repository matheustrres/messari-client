import { MessariAsset } from '../lib/typings';
import { Request } from '../lib/utils/request';
import messariApiGetAssetResponse from './fixtures/messari_api_get_asset_response.json';

const apiKey = process.env.MESSARI_API_KEY as string;

type MessariAssetSuccessfulResponse = {
	status: {
		elapsed: number;
		timestamp: string;
	};
	data: MessariAsset & {
		contract_addresses: string[] | null;
		_internal_temp_agora_id: string;
	};
};

type MessariAssetErrorResponse = {
	status: {
		elapsed: number;
		timestamp: string;
		error_code: number;
		error_message: string;
	};
	data?: never;
};

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

		it('should return data on success', async (): Promise<void> => {
			global.fetch = mockFetchResponse<MessariAssetSuccessfulResponse>(
				messariApiGetAssetResponse,
			);

			const response = await request.get<MessariAsset>('v1/assets/bitcoin');

			expect(response).toEqual(messariApiGetAssetResponse);
		});

		it('should return an error response when providing an invalid parameter', async (): Promise<void> => {
			const errorMessage = 'invalid param value for field id';

			global.fetch = mockFetchResponse<MessariAssetErrorResponse>({
				status: {
					elapsed: 10,
					error_code: 400,
					error_message: errorMessage,
					timestamp: new Date().toISOString(),
				},
			});

			const { status, data } = await request.get<MessariAsset>(
				'v1/assets/fake_asset_key',
			);

			expect(status.error_code).toBe(400);
			expect(status.error_message).toBe(errorMessage);

			expect(data).toBe(undefined);
		});
	});
});
