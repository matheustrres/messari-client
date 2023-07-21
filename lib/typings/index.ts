export type MessariAssetCommomProps = {
	id: string;
	serial_id?: number;
	symbol: string;
	name: string;
	slug: string;
};

export type MessariAsset = {
	data: MessariAssetCommomProps;
};

export type MessariAllAssets = {
	data: Array<
		MessariAssetCommomProps & {
			metrics: MessariAssetCommomProps & {
				market_data: MessariAssetMarketDataProps;
				marketcap: MessariAssetMarketCapProps;
				reddit?: {
					active_user_count: number;
					subscribers: number;
				};
			};
		}
	>;
};

export type MessariAssetMarketCapProps = {
	rank: number;
	marketcap_dominance_percent: number;
	current_marketcap_usd: number;
	liquid_marketcap_usd: number;
	volume_turnover_last_24_hours_percent: number;
	realized_marketcap_usd: number;
	outstanding_marketcap_usd: number;
};

export type MessariAssetMarketData = {
	data: MessariAssetCommomProps & {
		market_data: MessariAssetMarketDataProps;
	};
};

export type MessariAssetMarketDataProps = {
	price_usd: number;
	price_btc: number;
	price_eth: number;
	volume_last_24_hours: number;
	real_volume_last_24_hours: number;
	percent_change_usd_last_1_hour?: number | null;
	percent_change_btc_last_1_hour?: number | null;
	percent_change_eth_last_1_hour?: number | null;
	percent_change_usd_last_24_hours?: number | null;
	percent_change_btc_last_24_hours?: number | null;
	percent_change_eth_last_24_hours?: number | null;
	ohlcv_last_1_hour?: MessariAssetMarketOHLCVProps | null;
	ohlcv_last_24_hour?: MessariAssetMarketOHLCVProps | null;
	last_trade_at?: string | null;
};

export type MessariAssetMarketOHLCVProps = {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

export type MessariAssetMetrics = {
	data: MessariAssetCommomProps & {
		market_data: MessariAssetMarketDataProps;
		marketcap: MessariAssetMarketCapProps;
		roi_data: {
			percent_change_last_1_week: number;
			percent_change_last_1_month: number;
			percent_change_last_3_months: number;
			percent_change_last_1_year: number;
		};
		reddit?: {
			active_user_count: number;
			subscribers: number;
		};
	};
};

export type MessariAllNews = {
	data: [
		{
			id: string;
			title: string;
			content: string;
			references: Array<{
				name: string;
				url: string;
			}>;
			previewImage: string;
			pdfUrl: string;
			published_at: string;
			author: {
				name: string;
				url: string;
			};
			tags: string[];
			url: string;
		},
	];
};

export type MessariAssetNews = MessariAllNews;

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
