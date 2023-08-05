export type MessariAsset = {
	id: string;
	serial_id?: number;
	symbol: string;
	name: string;
	slug: string;
};

export type MessariAssetWithMetrics = {
	id: string;
	serial_id: number;
	symbol: string;
	name: string;
	slug: string;
	metrics: {
		all_time_high: MessariAssetMetricsAllTimeHigh;
		market_data: MessariAssetMarketData;
		marketcap: MessariAssetMarketCap;
		reddit?: MessariAssetReddit;
		roi_data: MessariAssetMetricsROIData;
	};
	// profile: {}
};

// ---

export type MessariAssetMetricsAllTimeHigh = {
	price: number;
	at: string;
	days_since: string;
	parcent_down: number;
	breakeven_multiple: number;
};

// ROI - Return Over Investment
export type MessariAssetMetricsROIData = {
	percent_change_last_1_week: number;
	percent_change_last_1_month: number;
	percent_change_last_3_months: number;
	percent_change_last_1_year: number;
};

export type MessariAssetMetrics = {
	id: string;
	serial_id: number;
	symbol: string;
	name: string;
	slug: string;
	all_time_high: MessariAssetMetricsAllTimeHigh;
	market_data: MessariAssetMarketData;
	marketcap: MessariAssetMarketCap;
	reddit?: MessariAssetReddit;
	roi_data: MessariAssetMetricsROIData;
};

// ---

export type MessariAssetMarketData = {
	price_usd: number;
	price_btc: number;
	price_eth: number;
	volume_last_24_hours: number;
	real_volume_last_24_hours: number;
	percent_change_usd_last_1_hour: number | null;
	percent_change_btc_last_1_hour: number | null;
	percent_change_eth_last_1_hour: number | null;
	percent_change_usd_last_24_hours: number | null;
	percent_change_btc_last_24_hours: number | null;
	percent_change_eth_last_24_hours: number | null;
	ohlcv_last_1_hour?: MessariAssetMarketOHLCV | null;
	ohlcv_last_24_hour?: MessariAssetMarketOHLCV | null;
	last_trade_at?: string | null;
};

export type MessariAssetMarketDataAPIResponse = {
	// Asset: MessariAsset;
	market_data: MessariAssetMarketData;
};

// ---
export type MessariMarket = {
	id: string;
	exchange_id: string;
	base_asset_id: string;
	quote_asset_id: string;
	trade_start: string | null;
	trade_end: string | null;
	version: number;
	excluded_from_price: boolean;
	exchange_name: string;
	exchange_slug: string;
	base_asset_symbol: string;
	quote_asset_symbol: string;
	pair: string;
	price_usd: number | null;
	vwap_weight: number;
	volume_last_24_hours: number | null;
	has_real_volume: boolean;
	deviation_from_vwap_percent: number | null;
	last_trade_at: string | null;
};

// ---

export type MessariAssetNews = {
	id: string;
	title: string;
	content: string;
	references: Array<{
		name: string;
		url: string | null;
	}>;
	previewImage: string;
	pdfUrl: string | null;
	published_at: string;
	author: {
		name: string;
		url: string | null;
	};
	tags: string[];
	url: string;
};

// ---

export type MessariAssetMarketCap = {
	rank: number;
	marketcap_dominance_percent: number;
	current_marketcap_usd: number;
	liquid_marketcap_usd: number;
	volume_turnover_last_24_hours_percent: number;
	realized_marketcap_usd: number;
	outstanding_marketcap_usd: number;
};

export type MessariAssetMarketOHLCV = {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

export type MessariAssetReddit = {
	active_user_count: number | null;
	subscribers: number | null;
};

// ---

/**
 * Base result of all requests made to the Messari api
 * 
 * @template T - Typing for an endpoint response
 */
export type QueryResult<T = any> =
	| {
			/* Request failed */
			status: {
				error_code: number;
				error_message: string;
				timestamp: string;
			};
			data?: never;
	  }
	| {
			/* Request succeeded */
			status: {
				error_code?: never;
				error_message?: never;
				timestamp: string;
			};
			data: T;
	  };
