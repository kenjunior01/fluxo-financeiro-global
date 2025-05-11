
export type UserRole = 'super_admin' | 'admin' | 'account_manager' | 'trader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type AssetType = 'forex' | 'crypto' | 'stock' | 'commodity' | 'index' | 'bond' | 'etf';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  previousPrice?: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  marketCap?: number;
}

export interface Position {
  id: string;
  userId: string;
  managerUserId?: string;
  asset: Asset;
  type: 'buy' | 'sell';
  amount: number;
  leverage: number;
  openPrice: number;
  currentPrice: number;
  openDate: string;
  stopLoss?: number;
  takeProfit?: number;
  profit: number;
  profitPercent: number;
  status: 'open' | 'closed';
  isAutomated: boolean;
}

export interface ChartData {
  time: string;
  value: number;
}

export interface TimeframeOption {
  label: string;
  value: string;
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface AlertSettings {
  priceTarget: number;
  direction: 'above' | 'below';
  message: string;
  active: boolean;
  symbol: string;
}
