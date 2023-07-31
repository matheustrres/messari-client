import { MessariClient } from '../lib/client';
import { MessariAssetMarketData } from '../lib/typings';

describe('MessariClient', (): void => {
  let client: MessariClient;

  beforeAll((): void => {
    client = new MessariClient({
      key: process.env.MESSARI_API_KEY as string,
    });
  });

  it('should be defined', (): void => {
    expect(client).toBeDefined();
  });

  describe('.getAsset', (): void => {
    it('should get basic metadata for an asset', async (): Promise<void> => {
      const { status, data } = await client.getAsset('bitcoin');

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data).toBeDefined();
      expect(data!.id).toBeDefined();
      expect(data!.serial_id).toBe(6057);
      expect(data!.symbol).toBe('BTC');
      expect(data!.name).toBe('Bitcoin');
      expect(data!.slug).toBe('bitcoin');
    });
  });

  describe('.getAssetMetrics', (): void => {
    it('should get all the quantitative metrics for an asset', async (): Promise<void> => {
      const { status, data } = await client.getAssetMetrics('Polkadot');

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data!.id).toBeDefined();
      expect(data!.serial_id).toBe(373);
      expect(data!.symbol).toBe('DOT');
      expect(data!.name).toBe('Polkadot');
      expect(data!.slug).toBe('polkadot');
      expect(data!.market_data).toBeDefined();
      expect(data!.marketcap).toBeDefined();
      expect(data!.reddit).toBeDefined();
      expect(data!.all_time_high).toBeDefined();
      expect(data!.roi_data).toBeDefined();
    });
  });

  describe('.getAssetMarketData', (): void => {
    it('should get the latest market-data for an asset.', async (): Promise<void> => {
      type MyAssetMarketData = MessariAssetMarketData & {
        Asset: {
          id: string;
          name: string;
          symbol: string;
          slug: string;
          serial_id: number;
        };
      };

      const { status, data } = await client.getAssetMarketData<MyAssetMarketData>('ethereum');

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data!.Asset).toBeDefined();
      expect(data!.Asset.id).toBeDefined();
      expect(data!.Asset.serial_id).toBe(6059);
      expect(data!.Asset.symbol).toBe('ETH');
      expect(data!.Asset.name).toBe('Ethereum');
      expect(data!.Asset.slug).toBe('ethereum');

      expect(data!.market_data).toBeDefined();
      expect(data!.market_data.price_usd).toBeDefined();
      expect(data!.market_data.price_eth).toBeDefined();
      expect(data!.market_data.price_btc).toBeDefined();
      expect(data!.market_data.ohlcv_last_1_hour).toBeDefined();
      expect(data!.market_data.ohlcv_last_24_hour).toBeDefined();
    });
  });

  describe('.listAllAssets', (): void => {
    it('should get the paginated list of all assets and their metrics', async (): Promise<void> => {
      const { status, data } = await client.listAllAssets({
        limit: 6,
        page: 2,
      });

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data).toBeDefined();
      expect(data!.length).toBe(6);
      expect(data![0].id).toBeDefined();
      expect(data![1].id).toBeDefined();
      expect(data![2].id).toBeDefined();
      expect(data![3].id).toBeDefined();
      expect(data![4].id).toBeDefined();
      expect(data![5].id).toBeDefined();
      expect(data![6]).toBe(undefined);
    });
  });

  describe('.listAllAssetsNews', (): void => {
    it('should get the paginated list of latest news and analysis for all assets', async (): Promise<void> => {
      const { status, data } = await client.listAllAssetsNews({
        limit: 3,
        page: 2,
      });

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data).toBeDefined();
      expect(data![0].id).toBeDefined();
      expect(data![0].title).toBeDefined();
      expect(data![1].id).toBeDefined();
      expect(data![1].title).toBeDefined();
      expect(data![2].id).toBeDefined();
      expect(data![2].title).toBeDefined();
      expect(data![3]).toBe(undefined);
    });
  });

  describe('.listAssetNews', (): void => {
    it.only('should get the paginated list of latest news and analysis for an asset', async (): Promise<void> => {
      const { status, data } = await client.listAssetNews('ethereum', {
        limit: 4,
      });

      expect(status.error_code).toBe(undefined);
      expect(status.error_message).toBe(undefined);

      expect(data).toBeDefined();
      expect(data![0].id).toBeDefined();
      expect(data![0].title).toBeDefined();
      expect(data![1].id).toBeDefined();
      expect(data![1].title).toBeDefined();
      expect(data![2].id).toBeDefined();
      expect(data![2].title).toBeDefined();
      expect(data![3].id).toBeDefined();
      expect(data![3].title).toBeDefined();
      expect(data![4]).toBe(undefined);
    });
  });

  it('should fail when searching for an invalid asset', async (): Promise<void> => {
    await expect(client.getAsset('fake-asset').then(res => res.status.error_code)).resolves.toBeDefined();
    await expect(client.getAssetMetrics('fake-asset').then(res => res.status.error_code)).resolves.toBeDefined();
  });
});
