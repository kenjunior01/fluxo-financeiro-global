
import { Asset, AssetType, ChartData, MarketNewsItem, Position, TickerData, User } from "@/types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@fluxofinanceiro.com",
    role: "super_admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=João"
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@fluxofinanceiro.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
  },
  {
    id: "3",
    name: "Carlos Santos",
    email: "carlos@fluxofinanceiro.com",
    role: "account_manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@exemplo.com",
    role: "trader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
  }
];

// Mock assets
export const mockAssets: Asset[] = [
  {
    id: "1",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    type: "forex",
    price: 1.0921,
    previousPrice: 1.0915,
    change: 0.0006,
    changePercent: 0.055,
    volume: 98546000,
    high: 1.0932,
    low: 1.0899,
    open: 1.0915
  },
  {
    id: "2",
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    type: "crypto",
    price: 63241.5,
    previousPrice: 62893.2,
    change: 348.3,
    changePercent: 0.55,
    volume: 28756000000,
    high: 63500.0,
    low: 62100.0,
    open: 62893.2,
    marketCap: 1230000000000
  },
  {
    id: "3",
    symbol: "GOLD",
    name: "Gold Spot",
    type: "commodity",
    price: 2337.85,
    previousPrice: 2327.10,
    change: 10.75,
    changePercent: 0.46,
    volume: 178560000,
    high: 2342.50,
    low: 2325.30,
    open: 2327.10
  },
  {
    id: "4",
    symbol: "PETR4",
    name: "Petrobras PN",
    type: "stock",
    price: 38.42,
    previousPrice: 38.65,
    change: -0.23,
    changePercent: -0.59,
    volume: 65789000,
    high: 38.75,
    low: 38.21,
    open: 38.65
  },
  {
    id: "5",
    symbol: "IBOV",
    name: "Ibovespa",
    type: "index",
    price: 126834,
    previousPrice: 126503,
    change: 331,
    changePercent: 0.26,
    volume: 10456000000,
    high: 127100,
    low: 126400,
    open: 126503
  },
  {
    id: "6",
    symbol: "ETH/USD",
    name: "Ethereum / US Dollar",
    type: "crypto",
    price: 3052.25,
    previousPrice: 3037.80,
    change: 14.45,
    changePercent: 0.48,
    volume: 15678900000,
    high: 3078.50,
    low: 3022.75,
    open: 3037.80,
    marketCap: 368000000000
  },
  {
    id: "7",
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    type: "forex",
    price: 155.63,
    previousPrice: 155.42,
    change: 0.21,
    changePercent: 0.14,
    volume: 76543000,
    high: 155.78,
    low: 155.32,
    open: 155.42
  },
  {
    id: "8",
    symbol: "BRENT",
    name: "Brent Crude Oil",
    type: "commodity",
    price: 82.53,
    previousPrice: 83.16,
    change: -0.63,
    changePercent: -0.76,
    volume: 245670000,
    high: 83.25,
    low: 82.36,
    open: 83.16
  }
];

// Generate chart data
export const generateChartData = (days: number, volatility: number = 0.02): ChartData[] => {
  const now = new Date();
  const data: ChartData[] = [];
  
  let value = 100 + Math.random() * 20;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Add some randomness to the value
    value = value + (value * (Math.random() * volatility * 2 - volatility));
    
    data.push({
      time: date.toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  return data;
};

// Mock positions
export const mockPositions: Position[] = [
  {
    id: "1",
    userId: "4",
    managerUserId: "3",
    asset: mockAssets[0], // EUR/USD
    type: "buy",
    amount: 10000,
    leverage: 30,
    openPrice: 1.0890,
    currentPrice: 1.0921,
    openDate: "2023-04-25T14:30:00Z",
    stopLoss: 1.0850,
    takeProfit: 1.0950,
    profit: 31,
    profitPercent: 0.28,
    status: "open",
    isAutomated: true
  },
  {
    id: "2",
    userId: "4",
    asset: mockAssets[2], // GOLD
    type: "sell",
    amount: 5000,
    leverage: 10,
    openPrice: 2350.40,
    currentPrice: 2337.85,
    openDate: "2023-05-02T09:15:00Z",
    stopLoss: 2365.00,
    takeProfit: 2320.00,
    profit: 12.55,
    profitPercent: 0.53,
    status: "open",
    isAutomated: false
  },
  {
    id: "3",
    userId: "4",
    managerUserId: "3",
    asset: mockAssets[1], // BTC/USD
    type: "buy",
    amount: 2000,
    leverage: 5,
    openPrice: 61500,
    currentPrice: 63241.5,
    openDate: "2023-05-03T21:45:00Z",
    stopLoss: 60000,
    takeProfit: 65000,
    profit: 1741.5,
    profitPercent: 2.83,
    status: "open",
    isAutomated: true
  },
  {
    id: "4",
    userId: "4",
    asset: mockAssets[3], // PETR4
    type: "sell",
    amount: 15000,
    leverage: 2,
    openPrice: 39.10,
    currentPrice: 38.42,
    openDate: "2023-05-08T10:30:00Z",
    stopLoss: 40.00,
    takeProfit: 37.50,
    profit: 68,
    profitPercent: 1.74,
    status: "open",
    isAutomated: false
  }
];

// Mock ticker data
export const mockTickers: TickerData[] = [
  { symbol: "EUR/USD", price: 1.0921, change: 0.0006, changePercent: 0.055 },
  { symbol: "GBP/USD", price: 1.2542, change: -0.0015, changePercent: -0.12 },
  { symbol: "USD/JPY", price: 155.63, change: 0.21, changePercent: 0.14 },
  { symbol: "BTC/USD", price: 63241.5, change: 348.3, changePercent: 0.55 },
  { symbol: "ETH/USD", price: 3052.25, change: 14.45, changePercent: 0.48 },
  { symbol: "GOLD", price: 2337.85, change: 10.75, changePercent: 0.46 },
  { symbol: "IBOV", price: 126834, change: 331, changePercent: 0.26 }
];

// Mock market news
export const mockNews: MarketNewsItem[] = [
  {
    id: "1",
    title: "Fed mantém taxa de juros e prevê cortes ainda este ano",
    source: "Financial Times",
    url: "#",
    imageUrl: "https://placehold.co/200x120",
    publishedAt: "2023-05-10T15:30:00Z",
    sentiment: "positive"
  },
  {
    id: "2",
    title: "Bitcoin atinge novo recorde histórico acima de $70.000",
    source: "CoinDesk",
    url: "#",
    imageUrl: "https://placehold.co/200x120",
    publishedAt: "2023-05-10T12:45:00Z",
    sentiment: "positive"
  },
  {
    id: "3",
    title: "Inflação na zona do euro cai para 2.4% em abril",
    source: "Bloomberg",
    url: "#",
    imageUrl: "https://placehold.co/200x120",
    publishedAt: "2023-05-10T09:15:00Z",
    sentiment: "positive"
  },
  {
    id: "4",
    title: "Petróleo cai após aumento inesperado nos estoques dos EUA",
    source: "Reuters",
    url: "#",
    imageUrl: "https://placehold.co/200x120",
    publishedAt: "2023-05-09T23:00:00Z",
    sentiment: "negative"
  },
  {
    id: "5",
    title: "Banco Central do Brasil sinaliza possível alta na Selic",
    source: "Valor Econômico",
    url: "#",
    imageUrl: "https://placehold.co/200x120",
    publishedAt: "2023-05-09T18:20:00Z",
    sentiment: "neutral"
  }
];

// Function to update mock asset prices randomly
export const updateAssetPrices = (): Asset[] => {
  return mockAssets.map(asset => {
    const previousPrice = asset.price;
    const priceChange = previousPrice * (Math.random() * 0.01 - 0.005); // -0.5% to +0.5%
    const newPrice = previousPrice + priceChange;
    
    return {
      ...asset,
      previousPrice,
      price: parseFloat(newPrice.toFixed(asset.type === 'crypto' ? 2 : 4)),
      change: parseFloat(priceChange.toFixed(asset.type === 'crypto' ? 2 : 4)),
      changePercent: parseFloat((priceChange / previousPrice * 100).toFixed(2))
    };
  });
};

// Function to update mock positions with new prices
export const updatePositions = (assets: Asset[]): Position[] => {
  return mockPositions.map(position => {
    const asset = assets.find(a => a.symbol === position.asset.symbol);
    if (!asset) return position;
    
    const newPosition = { ...position, asset };
    newPosition.currentPrice = asset.price;
    
    // Calculate new profit
    const priceDiff = position.type === 'buy' 
      ? newPosition.currentPrice - newPosition.openPrice
      : newPosition.openPrice - newPosition.currentPrice;
      
    newPosition.profit = parseFloat((priceDiff * newPosition.amount * newPosition.leverage).toFixed(2));
    newPosition.profitPercent = parseFloat(((priceDiff / newPosition.openPrice) * 100 * newPosition.leverage).toFixed(2));
    
    return newPosition;
  });
};

// Function to update tickers
export const updateTickers = (assets: Asset[]): TickerData[] => {
  const updatedTickers = [...mockTickers];
  
  assets.forEach(asset => {
    const tickerIndex = updatedTickers.findIndex(t => t.symbol === asset.symbol);
    if (tickerIndex >= 0) {
      updatedTickers[tickerIndex] = {
        symbol: asset.symbol,
        price: asset.price,
        change: asset.change,
        changePercent: asset.changePercent
      };
    }
  });
  
  return updatedTickers;
};
