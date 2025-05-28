
import { useState, useEffect, useCallback, useRef } from 'react';
import { Asset, TickerData } from '@/types';

interface UseRealTimeDataProps {
  symbols: string[];
  updateInterval?: number;
  enabled?: boolean;
}

interface RealTimeDataState {
  assets: Asset[];
  tickers: TickerData[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export function useRealTimeData({ 
  symbols, 
  updateInterval = 30000, // 30 seconds default
  enabled = true 
}: UseRealTimeDataProps) {
  const [state, setState] = useState<RealTimeDataState>({
    assets: [],
    tickers: [],
    isLoading: true,
    error: null,
    lastUpdate: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Batch requests to avoid rate limiting
      const batchSize = 5;
      const batches = [];
      for (let i = 0; i < symbols.length; i += batchSize) {
        batches.push(symbols.slice(i, i + batchSize));
      }

      const allResults = [];
      for (const batch of batches) {
        const batchPromises = batch.map(async (symbol) => {
          try {
            const response = await fetch('/api/market-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ symbol, function: 'GLOBAL_QUOTE' }),
              signal: abortControllerRef.current?.signal
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return { symbol, data, success: true };
          } catch (error) {
            console.warn(`Failed to fetch ${symbol}:`, error);
            return { symbol, error: error.message, success: false };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);

        // Small delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Process successful results
      const assets: Asset[] = [];
      const tickers: TickerData[] = [];

      allResults.forEach(result => {
        if (result.success && result.data?.["Global Quote"]) {
          const quote = result.data["Global Quote"];
          const price = parseFloat(quote["05. price"]);
          const change = parseFloat(quote["09. change"]);
          const changePercent = parseFloat(quote["10. change percent"].replace('%', ''));

          const asset: Asset = {
            id: result.symbol,
            symbol: result.symbol,
            name: result.symbol, // This could be enhanced with company names
            type: 'stock', // This could be determined by symbol pattern
            price,
            previousPrice: parseFloat(quote["08. previous close"]),
            change,
            changePercent,
            volume: parseInt(quote["06. volume"]),
            high: parseFloat(quote["03. high"]),
            low: parseFloat(quote["04. low"]),
            open: parseFloat(quote["02. open"])
          };

          const ticker: TickerData = {
            symbol: result.symbol,
            price,
            change,
            changePercent
          };

          assets.push(asset);
          tickers.push(ticker);
        }
      });

      setState(prev => ({
        ...prev,
        assets,
        tickers,
        isLoading: false,
        lastUpdate: new Date()
      }));

    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    }
  }, [symbols, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up interval for real-time updates
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(fetchData, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, updateInterval, enabled]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refresh
  };
}
