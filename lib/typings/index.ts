// ---------------- Utility types ----------------

type MetricsMap<K extends MessariAPIAvailableKeyMetrics[]> = {
	[key in K[number]]: MessariAPIMetrics[key] | never;
};

export type PickMetricsForAllAssets<K extends MessariAPIAvailableKeyMetrics[]> =
	MessariAsset & {
		metrics: MetricsMap<K>;
	};

export type PickMetricsForAsset<K extends MessariAPIAvailableKeyMetrics[]> =
	MessariAsset & MetricsMap<K>;

// ---------------- Lib Types ----------------

export type MessariAsset = {
	id: string;
	serial_id: number;
	symbol: string;
	name: string;
	slug: string;
};

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

// ---------------- API Metrics ----------------

export type MessariAPIAllTimeHighMetrics = {
	price: number;
	at: string;
	days_since: string;
	parcent_down: number;
	breakeven_multiple: number;
};

// ROI - Return Over Investment
export type MessariAPIROIDataMetrics = {
	percent_change_last_1_week: number;
	percent_change_last_1_month: number;
	percent_change_last_3_months: number;
	percent_change_last_1_year: number;
};

export type MessariAPIBlockchainStats24HoursMetrics = {
	count_of_active_addresses: number;
	transaction_volume: number;
	adjusted_transaction_volume: number;
	adjusted_nvt: number;
	median_tx_value: number;
	median_tx_fee: number;
	count_of_tx: number;
	count_of_payments: number;
	new_issuance: number;
	average_difficulty: number;
	kilobytes_added: number | null;
	count_of_blocks_added: number;
};

export type MessariAPICycleLowMetrics = {
	price: number;
	at: string | null;
	percent_up: number;
	days_since: number;
};

export type MessariAPIDeveloperActivityMetrics = {
	stars: number;
	watchers: number;
	commits_last_3_months: number | null;
	commits_last_1_year: number | null;
	lines_added_last_3_months: number | null;
	lines_added_last_1_year: number | null;
	lines_deleted_last_3_months: number | null;
	lines_deleted_last_1_year: number | null;
};

export type MessariAPIExchangeFlowsMetrics = {
	[key: string]: number | null;
};

export type MessariAPIMarketCapMetrics = {
	rank: number;
	marketcap_dominance_percent: number;
	current_marketcap_usd: number;
	liquid_marketcap_usd: number;
	volume_turnover_last_24_hours_percent: number;
	realized_marketcap_usd: number;
	outstanding_marketcap_usd: number;
};

export type MessariAPIMarketDataMetrics = {
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
	ohlcv_last_1_hour?: MessariAPIMarketOHLCVMetrics | null;
	ohlcv_last_24_hour?: MessariAPIMarketOHLCVMetrics | null;
	last_trade_at?: string | null;
};

export type MessariAPIMarketDataLiquidityMetrics = {
	clearing_prices_to_sell: number | null;
	marketcap: MessariAPIMarketCapMetrics;
	asset_bid_depth: number | null;
	usd_bid_depth: number | null;
	updated_at: string | null;
};

export type MessariAPIMinerFlowsMetrics = {
	supply_1hop_miners_usd: number;
	supply_1hop_miners_native_units: number;
	supply_miners_usd: number;
	supply_miners_native_units: number;
};

export type MessariAPIMiningStatsMetrics = {
	mining_algo: string;
	network_hash_rate: string;
	available_on_nicehash_percent: number;
	attack_appeal: number | null;
	hash_rate: number;
	hash_rate_30d_average: number;
	mining_revenue_per_hash_usd: number;
	mining_revenue_per_hash_native_units: number;
	mining_revenue_per_hash_per_second_usd: number;
	mining_revenue_per_hash_per_second_native_units: number;
	mining_revenue_from_fees_percent_last_24_hours: number;
	mining_revenue_native: number;
	mining_revenue_usd: number;
	mining_revenue_total: number;
	average_difficulty: number;
};

export type MessariAPIMiscDataMetrics = {
	private_market_price_usd: number | null;
	vladimir_club_cost: number | null;
	btc_current_normalized_supply_price_usd: number | null;
	btc_y2050_normalized_supply_price_usd: number | null;
	asset_created_at: string | null;
	asset_age_days: number | null;
	categories: string[];
	sectors: string[];
	tags: string[] | null;
};

export type MessariAPIOnChainDataMetrics = {
	[key: string]: number | null;
};

export type MessariAPIRedditMetrics = {
	active_user_count: number | null;
	subscribers: number | null;
};

export type MessariAPIRiskMetrics = {
	sharpe_ratios: {
		last_30_days: number;
		last_90_days: number;
		last_1_year: number;
		last_3_years: number;
	};
	volatility_stats: {
		volatility_last_30_days: number;
		volatility_last_90_days: number;
		volatility_last_1_year: number;
		volatility_last_3_years: number;
	};
};

export type MessariAPIROIByYearMetrics = {
	'2021_usd_percent': number;
	'2020_usd_percent': number;
	'2019_usd_percent': number;
	'2018_usd_percent': number;
	'2017_usd_percent': number;
	'2016_usd_percent': number;
	'2015_usd_percent': number;
	'2014_usd_percent': number;
	'2013_usd_percent': number;
	'2012_usd_percent': number;
	'2011_usd_percent': number;
};

export type MessariAPISupplyMetrics = {
	y_2050: number | null;
	y_plus10: number | null;
	y_2050_percent_issued: number | null;
	annual_inflation_percent: number | null;
	y_plus10_issued_percent: number | null;
	liquid: number | null;
	circulating: number | null;
	stock_to_flow: number | null;
	supply_revived_90d: number | null;
};

export type MessariAPISupplyActivityMetrics = {
	supply_active_10y: number;
	supply_active_180d: number;
	supply_active_1d: number;
	supply_active_1y: number;
	supply_active_1y_percent: number;
	supply_active_2y: number;
	supply_active_30d: number;
	supply_active_3y: number;
	supply_active_4y: number;
	supply_active_5y: number;
	supply_active_7d: number;
	supply_active_90d: number;
	supply_active_ever: number;
	outstanding: number;
	supply_revived_1y: number;
	supply_revived_2y: number;
	supply_revived_30d: number;
	supply_revived_3y: number;
	supply_revived_4y: number;
	supply_revived_5y: number;
	supply_revived_7d: number;
	supply_revived_90d: number;
};

export type MessariAPITokenSaleStatsMetrics = {
	sale_proceeds_usd: number | null;
	sale_start_date: string | null;
	sale_end_date: string | null;
	roi_since_sale_usd_percent: number | null;
	roi_since_sale_btc_percent: number | null;
	roi_since_sale_eth_percent: number | null;
};

export type MessariAPIMarketOHLCVMetrics = {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

type MessariAPIMetrics = {
	all_time_high?: MessariAPIAllTimeHighMetrics | never;
	blockchain_stats_24_hours?: MessariAPIBlockchainStats24HoursMetrics | never;
	cycle_low?: MessariAPICycleLowMetrics | never;
	developer_activity?: MessariAPIDeveloperActivityMetrics | never;
	exchange_flows?: MessariAPIExchangeFlowsMetrics | never;
	marketcap?: MessariAPIMarketCapMetrics | never;
	market_data?: MessariAPIMarketDataMetrics | never;
	market_data_liquidity?: MessariAPIMarketDataLiquidityMetrics | never;
	miner_flows?: MessariAPIMinerFlowsMetrics | never;
	mining_stats?: MessariAPIMiningStatsMetrics | never;
	misc_data?: MessariAPIMiscDataMetrics | never;
	on_chain_data?: MessariAPIOnChainDataMetrics | never;
	reddit?: MessariAPIRedditMetrics | never;
	risk_metrics?: MessariAPIRiskMetrics | never;
	roi_by_year?: MessariAPIROIByYearMetrics | never;
	roi_data?: MessariAPIROIDataMetrics | never;
	supply?: MessariAPISupplyMetrics | never;
	supply_activity?: MessariAPISupplyActivityMetrics | never;
	token_sale_stats?: MessariAPITokenSaleStatsMetrics | never;
};

// ---------------- API Utils ----------------

export type MessariAPIPaginationOptions = {
	page?: number;
	limit?: number;
	sort?: 'id'; // marketcap desc'
};

export type MessariAPIAssetOptions = {
	metrics?: MessariAPIAvailableKeyMetrics[];
};

export type MessariAPIAvailableKeyMetrics =
	| 'all_time_high'
	| 'blockchain_stats_24_hours'
	| 'cycle_low'
	| 'developer_activity'
	| 'exchange_flows'
	| 'market_data_liquidity'
	| 'market_data'
	| 'marketcap'
	| 'miner_flows'
	| 'mining_stats'
	| 'misc_data'
	| 'on_chain_data'
	| 'reddit'
	| 'risk_metrics'
	| 'roi_data'
	| 'roi_by_year'
	| 'supply_activity'
	| 'supply'
	| 'token_sale_stats';

/**
 * Base result of all requests made to the Messari api
 *
 * @template T - Typing for an endpoint response
 */
export type QueryResult<T = any> =
	| {
			/* Request failed */
			status: {
				/**
				 * Number of milliseconds taken to generate this response
				 */
				elapsed: number;
				error_code: number;
				error_message: string;
				timestamp: string;
			};
			data?: never;
	  }
	| {
			/* Request succeeded */
			status: {
				/**
				 * Number of milliseconds taken to generate this response
				 */
				elapsed: number;
				error_code?: never;
				error_message?: never;
				timestamp: string;
			};
			data: T;
	  };
