
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRealTimeData } from '@/hooks/useRealTimeData';

// Mock fetch
global.fetch = vi.fn();

describe('useRealTimeData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL', 'GOOGL'],
        updateInterval: 1000,
        enabled: true
      })
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.assets).toEqual([]);
    expect(result.current.tickers).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('fetches data for provided symbols', async () => {
    const mockResponse = {
      "Global Quote": {
        "01. symbol": "AAPL",
        "02. open": "150.00",
        "03. high": "155.00",
        "04. low": "149.00",
        "05. price": "152.50",
        "06. volume": "1000000",
        "07. latest trading day": "2024-01-01",
        "08. previous close": "151.00",
        "09. change": "1.50",
        "10. change percent": "0.99%"
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: true
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/market-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: 'AAPL', function: 'GLOBAL_QUOTE' }),
      signal: expect.any(AbortSignal)
    });
  });

  it('handles fetch errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: true
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.isLoading).toBe(false);
  });

  it('respects enabled flag', () => {
    const { result } = renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: false
      })
    );

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(true);
  });

  it('batches requests to avoid rate limiting', async () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ "Global Quote": {} })
    });

    renderHook(() =>
      useRealTimeData({
        symbols,
        updateInterval: 1000,
        enabled: true
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should make 6 calls (one for each symbol) in batches
    expect(global.fetch).toHaveBeenCalledTimes(6);
  });

  it('provides refresh function', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ "Global Quote": {} })
    });

    const { result } = renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: true
      })
    );

    await act(async () => {
      result.current.refresh();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should be called at least twice (initial + refresh)
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('sets up interval for real-time updates', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ "Global Quote": {} })
    });

    renderHook(() =>
      useRealTimeData({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: true
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Should be called multiple times due to interval
    expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + 2 interval calls
  });
});
