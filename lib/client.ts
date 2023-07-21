import {
  MessariAllAssets,
  MessariAsset,
  MessariAssetCommomProps,
  MessariAssetMarketDataProps,
  MessariAssetMetrics,
  MessariAllNews,
  MessariAssetNews,
  QueryResult,
} from './typings';
import { MessariError } from './utils/errors/messari/messari.error';
import { Request } from './utils/request';

type MessariClientProps = {
  key: string;
}

/**
 * Represents the main MessariClient
 */
export class MessariClient {
  private request: Request;
  private messariApiKey: string;

  static validate(apiKey: string): void {
    if (!apiKey) {
      throw new TypeError('An api key must be provided and be of type string');
    }
  }

  /**
   * Creates a new MessariClient instance
   * 
   * @param {String} props.messariApiKey - A valid Messari api key  
   */
  constructor (props: MessariClientProps) {
    MessariClient.validate(props.key);

    this.messariApiKey = props.key;

    this.request = new Request({
      messariHeaderApiKey: this.messariApiKey
    });
  }

  /**
   * Get the basic metadata for an asset
   * 
   * @param {string} assetKey - The asset's ID, slug or symbol
   * @returns {Promise<QueryResult<MessariAssetCommomProps>>}
   */
  public async getAsset(assetKey: string): Promise<QueryResult<MessariAssetCommomProps>> {
    const response = await this.request.get<
      MessariAsset
    >(`v1/assets/${assetKey}`);

    if (response instanceof MessariError) {
      return this.$handleError(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  /**
   * Get the quantitative metrics for an asset
   * 
   * @param {string} assetKey - The asset's ID, slug or symbol
   * @returns {Promise<QueryResult<MessariAssetMetrics['data']>>}
   */
  public async getAssetMetrics(assetKey: string): Promise<QueryResult<MessariAssetMetrics['data']>> {
    const response = await this.request.get<
      MessariAssetMetrics
    >(`v1/assets/${assetKey}/metrics`);

    if (response instanceof MessariError) {
      return this.$handleError(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }


  /**
   * Get the market data for an asset
   * 
   * @param {string} assetKey - The asset's ID, slug or symbol
   * @returns {Promise<QueryResult<MessariAssetMarketDataProps>>}
   */
  public async getAssetMarketData(assetKey: string): Promise<QueryResult<MessariAssetMarketDataProps>> {
    const response: QueryResult<MessariAssetMetrics['data']> = await this.getAssetMetrics(assetKey);

    const assetMarketData: MessariAssetMarketDataProps =
      !response.status.error_code &&
      response.data.market_data;

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: assetMarketData,
    }
  }

  /**
   * Get the list of all assets and their metrics
   * 
   * @returns {Promise<QueryResult<MessariAllAssets['data']>>}
   */
  public async listAllAssets(): Promise<QueryResult<MessariAllAssets['data']>> {
    const response = await this.request.get<
      MessariAllAssets
    >(`v2/assets`);

    if (response instanceof MessariError) {
      return this.$handleError(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  /**
   * Get the latest news and analysis for all assets
   * 
   * @returns {Promise<QueryResult<MessariAllNews['data']>>}
   */
  public async listAllNews(): Promise<QueryResult<MessariAllNews['data']>> {
    const response = await this.request.get<
      MessariAllNews
    >('v1/news');

    if (response instanceof MessariError) {
      return this.$handleError(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  /**
   * Get the latest news and analysis for an asset
   * 
   * @param {string} assetKey - The asset's ID, slug or symbol
   * @returns {Promise<QueryResult<MessariAssetNews['data']>>}
   */
  public async listAssetNews(assetKey: string): Promise<QueryResult<MessariAssetNews['data']>> {
    const response = await this.request.get<
      MessariAssetNews
    >(`v1/news/${assetKey}`);

    if (response instanceof MessariError) {
      return this.$handleError(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  private $handleError(error: MessariError): QueryResult {
    return {
      status: {
        timestamp: error.timestamp,
        error_code: error.code,
        error_message: error.message
      }
    }
  }
}

