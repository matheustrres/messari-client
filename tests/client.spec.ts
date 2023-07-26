import { MessariClient } from '../lib/client';

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

  describe('getAsset', (): void => {
    it('should get basic metadata for an asset', async (): Promise<void> => {
      const asset = await client.getAsset('ethereum');

      expect(asset.status.error_code).toBeUndefined();
      expect(asset.data).toBeDefined();
      expect(asset.data!.id).toBeDefined();
      expect(asset.data!.name).toBe('Ethereum');
      expect(asset.data!.symbol).toBe('ETH');
      expect(asset.data!.slug).toBe('ethereum');
    });
  });

  describe('getAssetMarketData', (): void => {
    it('should get the market data for an asset', async (): Promise<void> => {
      const marketData = await client.getAssetMarketData('ethereum');

      expect(marketData.status.error_code).toBeUndefined();
      expect(marketData.data).toBeDefined();
    });
  });

  describe('getAssetMetrics', (): void => {
    it('should get an asset metrics', async (): Promise<void> => {
      const metrics = await client.getAssetMetrics('ethereum');

      expect(metrics.status.error_code).toBeUndefined();
      expect(metrics.data).toBeDefined();
      expect(metrics.data!.id).toBeDefined();
      expect(metrics.data!.name).toBeDefined();
      expect(metrics.data!.market_data).toBeDefined();
      expect(metrics.data!.market_data).toBeDefined();
      expect(metrics.data!.marketcap).toBeDefined();
    });
  });

  describe('listAllAssets', (): void => {
    it('should list all or few assets', async (): Promise<void> => {
      const assets = await client.listAllAssets();

      expect(assets.status.error_code).toBeUndefined();
      expect(assets.data).toBeDefined();
      expect(assets.data![0].id).toBeDefined();
      expect(assets.data![0].name).toBeDefined();
      expect(assets.data![0].metrics).toBeDefined();
    });
  });

  describe('listAllNews', (): void => {
    it('should list all news and analysis for all assets', async (): Promise<void> => {
      const allNews = await client.listAllNews();

      expect(allNews.status.error_code).toBeUndefined();
      expect(allNews.data).toBeDefined();
      expect(allNews.data![0].id).toBeDefined();
      expect(allNews.data![0].title).toBeDefined();
      expect(allNews.data![0].content).toBeDefined();
    });
  });

  describe('listAssetNews', (): void => {
    it('should list news for an asset', async (): Promise<void> => {
      const assetNews = await client.listAssetNews('ethereum');

      expect(assetNews.status.error_code).toBeUndefined();
      expect(assetNews.data).toBeDefined();
      expect(assetNews.data![0].id).toBeDefined();
      expect(assetNews.data![0].title).toBeDefined();
      expect(assetNews.data![0].content).toBeDefined();
    });
  })

  it('should fail when searching for an invalid asset', async (): Promise<void> => {
    await expect(client.getAsset('fake-asset').then(res => res.status.error_code)).resolves.toBeDefined();
    await expect(client.getAssetMetrics('fake-asset').then(res => res.status.error_code)).resolves.toBeDefined();
  });
});
