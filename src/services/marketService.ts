
import { supabase } from "@/integrations/supabase/client";
import { Asset, ChartData, MarketNewsItem, TickerData } from "@/types";
import { 
  mockAssets as mockAssetsData,
  mockPositions as mockPositionsData,
  mockTickers as mockTickersData,
  mockNews as mockNewsData,
  updateAssetPrices as updateAssetPricesFunc,
  updatePositions as updatePositionsFunc,
  updateTickers as updateTickersFunc
} from "./mockData";

// Re-export mock data with different variable names para evitar conflitos
export const mockAssets = mockAssetsData;
export const mockPositions = mockPositionsData;
export const mockTickers = mockTickersData;
export const mockNews = mockNewsData;
export const updateAssetPrices = updateAssetPricesFunc;
export const updatePositions = updatePositionsFunc;
export const updateTickers = updateTickersFunc;

export async function fetchRealTimeQuote(symbol: string): Promise<Asset | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-market-data', {
      body: { symbol, function: 'GLOBAL_QUOTE' }
    });

    if (error) {
      console.error("Error fetching real-time quote:", error);
      return null;
    }

    if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
      console.warn("No data returned for symbol:", symbol);
      return null;
    }

    const quote = data["Global Quote"];
    const previousClose = parseFloat(quote["08. previous close"]);
    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"]);
    const changePercent = parseFloat(quote["10. change percent"].replace('%', ''));

    // Find existing asset or create a new one with real data
    const existingAsset = mockAssets.find(a => a.symbol === symbol);
    if (existingAsset) {
      return {
        ...existingAsset,
        price,
        previousPrice: previousClose,
        change,
        changePercent,
        open: parseFloat(quote["02. open"]),
        high: parseFloat(quote["03. high"]),
        low: parseFloat(quote["04. low"]),
        volume: parseInt(quote["06. volume"]),
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchRealTimeQuote:", error);
    return null;
  }
}

export async function fetchChartData(symbol: string, timeframe: string): Promise<ChartData[]> {
  try {
    let func: string;
    
    switch (timeframe) {
      case '1d':
        func = 'TIME_SERIES_INTRADAY';
        break;
      case '1w':
      case '1m':
      case '3m':
      case '1y':
        func = 'TIME_SERIES_DAILY';
        break;
      default:
        func = 'TIME_SERIES_DAILY';
    }
    
    const { data, error } = await supabase.functions.invoke('get-market-data', {
      body: { symbol, function: func }
    });

    if (error) {
      console.error("Error fetching chart data:", error);
      throw new Error(error.message);
    }

    // If intraday data
    if (func === 'TIME_SERIES_INTRADAY' && data['Time Series (5min)']) {
      const timeSeriesData = data['Time Series (5min)'];
      return Object.entries(timeSeriesData)
        .map(([time, values]: [string, any]) => ({
          time,
          value: parseFloat(values['4. close'])
        }))
        .reverse();
    }
    
    // If daily data
    if (func === 'TIME_SERIES_DAILY' && data['Time Series (Daily)']) {
      const timeSeriesData = data['Time Series (Daily)'];
      const entries = Object.entries(timeSeriesData);
      
      // Filter data based on timeframe
      let filteredEntries;
      const now = new Date();
      
      switch(timeframe) {
        case '1w':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          filteredEntries = entries.filter(([time]) => new Date(time) >= oneWeekAgo);
          break;
        case '1m':
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          filteredEntries = entries.filter(([time]) => new Date(time) >= oneMonthAgo);
          break;
        case '3m':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          filteredEntries = entries.filter(([time]) => new Date(time) >= threeMonthsAgo);
          break;
        case '1y':
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          filteredEntries = entries.filter(([time]) => new Date(time) >= oneYearAgo);
          break;
        default:
          filteredEntries = entries.slice(0, 30); // Default to last 30 days
      }
      
      return filteredEntries
        .map(([time, values]: [string, any]) => ({
          time,
          value: parseFloat(values['4. close'])
        }))
        .reverse();
    }
    
    throw new Error('No valid data returned from API');
  } catch (error) {
    console.error("Error in fetchChartData:", error);
    // Fall back to mock data if API fails
    return mockChartData(timeframe);
  }
}

export async function fetchMarketNews(symbols?: string): Promise<MarketNewsItem[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-market-news', {
      body: { 
        symbols,
        limit: 5,
        language: 'pt'
      }
    });

    if (error) {
      console.error("Error fetching market news:", error);
      throw new Error(error.message);
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid news data format');
    }

    return data.data.map((item: any) => ({
      id: item.uuid || String(item.id),
      title: item.title,
      source: item.source,
      url: item.url,
      imageUrl: item.image_url,
      publishedAt: item.published_at,
      sentiment: mapSentiment(item.sentiment)
    }));
  } catch (error) {
    console.error("Error in fetchMarketNews:", error);
    // Fall back to mock data
    return mockNews;
  }
}

function mapSentiment(sentiment: string | undefined): 'positive' | 'negative' | 'neutral' | undefined {
  if (!sentiment) return undefined;
  
  if (sentiment === 'Positive') return 'positive';
  if (sentiment === 'Negative') return 'negative';
  return 'neutral';
}

// Mock data for fallback
function mockChartData(timeframe: string): ChartData[] {
  const days = 
    timeframe === '1d' ? 1 :
    timeframe === '1w' ? 7 :
    timeframe === '1m' ? 30 :
    timeframe === '3m' ? 90 : 365;
  
  const now = new Date();
  const data: ChartData[] = [];
  
  let value = 100 + Math.random() * 20;
  const volatility = 0.02;
  
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
}
