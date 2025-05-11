
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Asset, Position, TickerData, ChartData, TimeframeOption } from "@/types";
import { 
  mockAssets, mockPositions, mockTickers, updateAssetPrices, 
  updatePositions, updateTickers
} from "@/services/mockData";
import { fetchRealTimeQuote, fetchChartData as fetchChartDataService, fetchMarketNews } from "@/services/marketService";
import { useAuth } from "./AuthContext";

interface MarketContextType {
  assets: Asset[];
  positions: Position[];
  tickers: TickerData[];
  chartData: Record<string, ChartData[]>;
  availableTimeframes: TimeframeOption[];
  selectedTimeframe: string;
  isLoading: boolean;
  isUpdating: boolean;
  fetchAssets: () => Promise<void>;
  fetchPositions: () => Promise<void>;
  fetchChartData: (symbol: string, timeframe: string) => Promise<ChartData[]>;
  setSelectedTimeframe: (timeframe: string) => void;
  openPosition: (position: Omit<Position, "id" | "openDate" | "profit" | "profitPercent" | "status" | "currentPrice">) => Promise<boolean>;
  closePosition: (positionId: string) => Promise<boolean>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const timeframeOptions: TimeframeOption[] = [
  { label: "1D", value: "1d" },
  { label: "1S", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1A", value: "1y" },
];

// Símbolos de ativos que serão atualizados com dados reais
const REAL_DATA_SYMBOLS = [
  "PETR4.SA", // Petrobras
  "VALE3.SA", // Vale
  "ITUB4.SA", // Itaú
  "BBDC4.SA", // Bradesco
  "ABEV3.SA", // Ambev
  "MGLU3.SA", // Magazine Luiza
  "BTCUSD",   // Bitcoin
  "ETHUSD",   // Ethereum
  "EUR=X",    // EUR/USD
  "GBP=X",    // GBP/USD
  "^BVSP",    // Ibovespa
];

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [tickers, setTickers] = useState<TickerData[]>(mockTickers);
  const [chartData, setChartData] = useState<Record<string, ChartData[]>>({});
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1d");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch real-time data for a specific asset
  const fetchRealAsset = useCallback(async (symbol: string) => {
    try {
      const updatedAsset = await fetchRealTimeQuote(symbol);
      if (updatedAsset) {
        return updatedAsset;
      }
      
      // If API call failed, use mock data as fallback
      const mockAsset = mockAssets.find(a => a.symbol === symbol);
      if (mockAsset) {
        return { ...mockAsset };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }, []);

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    setIsUpdating(true);
    
    try {
      // Try to get real data for configured symbols
      const realDataPromises = REAL_DATA_SYMBOLS.map(symbol => fetchRealAsset(symbol));
      const realAssets = await Promise.all(realDataPromises);
      
      // Filter out null results and combine with mock data for others
      const validRealAssets = realAssets.filter(Boolean) as Asset[];
      const updatedAssets = [...validRealAssets];
      
      // Use mock data for any assets that weren't fetched from the API
      mockAssets.forEach(mockAsset => {
        // Skip if we already have real data for this symbol
        if (!updatedAssets.some(a => a.symbol === mockAsset.symbol)) {
          // Add this mock asset with a random price update
          const updatedMockAsset = { 
            ...mockAsset,
            previousPrice: mockAsset.price,
            price: mockAsset.price * (1 + (Math.random() * 0.01 - 0.005)),
          };
          
          // Update change values
          updatedMockAsset.change = updatedMockAsset.price - (updatedMockAsset.previousPrice || updatedMockAsset.price);
          updatedMockAsset.changePercent = updatedMockAsset.previousPrice 
            ? (updatedMockAsset.change / updatedMockAsset.previousPrice) * 100
            : 0;
            
          updatedAssets.push(updatedMockAsset);
        }
      });
      
      setAssets(updatedAssets);
      
      // Update related data
      const updatedPositions = updatePositions(updatedAssets);
      setPositions(updatedPositions);
      
      // Transform assets to tickers
      const updatedTickers: TickerData[] = updatedAssets.map(asset => ({
        symbol: asset.symbol,
        price: asset.price,
        change: asset.change,
        changePercent: asset.changePercent
      }));
      
      setTickers(updatedTickers);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      
      // Fallback to mock data on error
      const updatedAssets = updateAssetPrices();
      setAssets(updatedAssets);
      
      const updatedPositions = updatePositions(updatedAssets);
      setPositions(updatedPositions);
      
      const updatedTickers = updateTickers(updatedAssets);
      setTickers(updatedTickers);
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [fetchRealAsset]);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    try {
      // In a real app, this would be an API call filtered by user ID
      // For our demo, we'll just filter the mock data
      const userPositions = mockPositions.filter(p => 
        p.userId === currentUser.id || 
        (currentUser.role === "account_manager" && p.managerUserId === currentUser.id) ||
        ["super_admin", "admin"].includes(currentUser.role)
      );
      
      // Update positions with latest asset prices
      const updatedPositions = updatePositions(assets);
      setPositions(updatedPositions);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [assets, currentUser]);

  // Fetch chart data for a specific asset and timeframe
  const fetchChartData = useCallback(async (symbol: string, timeframe: string): Promise<ChartData[]> => {
    try {
      // Check if we already have cached data
      const cacheKey = `${symbol}-${timeframe}`;
      
      // If this is already loading, return an empty array
      if (chartData[cacheKey]) {
        return chartData[cacheKey];
      }
      
      // Fetch chart data from the service
      const data = await fetchChartDataService(symbol, timeframe);
      
      // Cache the data
      setChartData(prev => ({
        ...prev,
        [cacheKey]: data
      }));
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch chart data for ${symbol}:`, error);
      // Return empty array on error
      return [];
    }
  }, [chartData]);

  // Open a new position
  const openPosition = useCallback(async (positionData: Omit<Position, "id" | "openDate" | "profit" | "profitPercent" | "status" | "currentPrice">): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // In a real app, this would be an API call
      // For our demo, we'll just add to the positions array
      
      const asset = assets.find(a => a.symbol === positionData.asset.symbol);
      if (!asset) return false;
      
      const newPosition: Position = {
        ...positionData,
        id: `${Date.now()}`,
        openDate: new Date().toISOString(),
        currentPrice: asset.price,
        profit: 0,
        profitPercent: 0,
        status: "open"
      };
      
      setPositions(prev => [...prev, newPosition]);
      return true;
    } catch (error) {
      console.error("Failed to open position:", error);
      return false;
    }
  }, [assets, currentUser]);

  // Close an existing position
  const closePosition = useCallback(async (positionId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For our demo, we'll just update the status
      
      setPositions(prev => 
        prev.map(p => 
          p.id === positionId 
            ? { ...p, status: "closed" } 
            : p
        )
      );
      
      return true;
    } catch (error) {
      console.error("Failed to close position:", error);
      return false;
    }
  }, []);

  // Set up regular data updates
  useEffect(() => {
    setIsLoading(true);
    
    // Initial fetch
    fetchAssets();
    
    // Set up periodic updates
    const interval = setInterval(() => {
      fetchAssets();
    }, 60000); // Update every minute instead of 5 seconds to respect API limits
    
    setUpdateInterval(interval);
    
    return () => {
      if (updateInterval) clearInterval(updateInterval);
    };
  }, [fetchAssets]);

  // Update positions when user changes
  useEffect(() => {
    if (currentUser) {
      fetchPositions();
    }
  }, [currentUser, fetchPositions]);

  const value = {
    assets,
    positions,
    tickers,
    chartData,
    availableTimeframes: timeframeOptions,
    selectedTimeframe,
    isLoading,
    isUpdating,
    fetchAssets,
    fetchPositions,
    fetchChartData,
    setSelectedTimeframe,
    openPosition,
    closePosition,
  };

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
};

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
};
