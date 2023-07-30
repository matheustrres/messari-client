import {
  MessariAllAssets,
  MessariAssetAPIResponse,
  MessariAsset,
  MessariAssetMetrics,
  MessariAllAssetsNews,
  MessariAssetNews,
  QueryResult,
  MessariAssetMetricsAPIResponse,
  MessariAssetMarketDataAPIResponse,
  MessariAssetMarketData,
  MessariAllAssetsAPIResponse,
  MessariAllAssetsNewsAPIResponse,
  MessariAssetNewsAPIResponse,
} from './typings';
import { MessariError } from './utils/errors/messari.error';
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
   * @returns {Promise<QueryResult<MessariAsset>>}
   */
  public async getAsset(assetKey: string): Promise<QueryResult<MessariAsset>> {
    const response = await this.request.get<
      MessariAssetAPIResponse
    >(`v1/assets/${assetKey}`);

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
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
   * @returns {Promise<QueryResult<MessariAssetMetrics>>}
   */
  public async getAssetMetrics(assetKey: string): Promise<QueryResult<MessariAssetMetrics>> {
    const response = await this.request.get<
      MessariAssetMetricsAPIResponse
    >(`v1/assets/${assetKey}/metrics`);

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
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
   * @returns {Promise<QueryResult<MessariAssetMarketData>>}
   */
  public async getAssetMarketData(assetKey: string): Promise<QueryResult<MessariAssetMarketData>> {
    const response = await this.request.get<
      MessariAssetMarketDataAPIResponse
    >(`v1/assets/${assetKey}/metrics/market-data`);

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  /**
   * Get the list of all assets and their metrics
   * 
   * @returns {Promise<QueryResult<MessariAllAssets>>}
   */
  public async listAllAssets(): Promise<QueryResult<MessariAllAssets>> {
    const response = await this.request.get<
      MessariAllAssetsAPIResponse
    >(`v2/assets`);

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
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
   * @returns {Promise<QueryResult<MessariAllNews>>}
   */
  public async listAllNews(): Promise<QueryResult<MessariAllAssetsNews>> {
    const response = await this.request.get<
      MessariAllAssetsNewsAPIResponse
    >('v1/news');

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
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
   * @returns {Promise<QueryResult<MessariAssetNews[]>>}
   */
  public async listAssetNews(assetKey: string): Promise<QueryResult<MessariAssetNews[]>> {
    const response = await this.request.get<
      MessariAssetNewsAPIResponse
    >(`v1/news/${assetKey}`);

    if (response instanceof MessariError) {
      return this.sendErrorResponse(response);
    }

    return {
      status: {
        timestamp: new Date().toISOString(),
      },
      data: response.data,
    }
  }

  private sendErrorResponse(error: MessariError): QueryResult {
    return {
      status: {
        timestamp: error.timestamp,
        error_code: error.code,
        error_message: error.message
      }
    }
  }
}

