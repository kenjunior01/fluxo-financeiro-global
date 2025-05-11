
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Asset, Position, TickerData, ChartData, TimeframeOption } from "@/types";
import { mockAssets, mockPositions, mockTickers, updateAssetPrices, updatePositions, updateTickers, generateChartData } from "@/services/mockData";
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

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would be an API call
      // For our demo, we'll use the mock data with random updates
      const updatedAssets = updateAssetPrices();
      setAssets(updatedAssets);
      
      // Update related data
      const updatedPositions = updatePositions(updatedAssets);
      setPositions(updatedPositions);
      
      const updatedTickers = updateTickers(updatedAssets);
      setTickers(updatedTickers);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, []);

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
    // In a real app, this would be an API call
    // For our demo, we'll generate random chart data based on timeframe
    
    let days = 1;
    switch (timeframe) {
      case "1d": days = 1; break;
      case "1w": days = 7; break;
      case "1m": days = 30; break;
      case "3m": days = 90; break;
      case "1y": days = 365; break;
    }
    
    const data = generateChartData(days, 0.02);
    
    // Cache the data
    setChartData(prev => ({
      ...prev,
      [`${symbol}-${timeframe}`]: data
    }));
    
    return data;
  }, []);

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
    }, 5000); // Update every 5 seconds
    
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
