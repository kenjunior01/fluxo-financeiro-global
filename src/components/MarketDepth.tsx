
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface MarketDepthData {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
  lastPrice: number;
}

interface MarketDepthProps {
  symbol: string;
}

export function MarketDepth({ symbol }: MarketDepthProps) {
  const [depthData, setDepthData] = useState<MarketDepthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock order book data (in a real app, this would come from a WebSocket)
  useEffect(() => {
    const generateOrderBook = () => {
      // Mock current price (in real app, get from real-time data)
      const lastPrice = 100 + Math.random() * 50;
      
      // Generate bids (buy orders) - prices below current price
      const bids: OrderBookEntry[] = [];
      let totalBidSize = 0;
      for (let i = 0; i < 10; i++) {
        const price = lastPrice - (i + 1) * 0.01 - Math.random() * 0.05;
        const size = Math.random() * 1000 + 100;
        totalBidSize += size;
        bids.push({ price, size, total: totalBidSize });
      }

      // Generate asks (sell orders) - prices above current price
      const asks: OrderBookEntry[] = [];
      let totalAskSize = 0;
      for (let i = 0; i < 10; i++) {
        const price = lastPrice + (i + 1) * 0.01 + Math.random() * 0.05;
        const size = Math.random() * 1000 + 100;
        totalAskSize += size;
        asks.unshift({ price, size, total: totalAskSize });
      }

      const spread = asks[0]?.price - bids[0]?.price || 0;
      const spreadPercent = (spread / lastPrice) * 100;

      setDepthData({
        symbol,
        bids: bids.reverse(),
        asks,
        spread,
        spreadPercent,
        lastPrice
      });
      setIsLoading(false);
    };

    generateOrderBook();
    
    // Update every 5 seconds (in real app, use WebSocket)
    const interval = setInterval(generateOrderBook, 5000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading || !depthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Book de Ofertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">
              Carregando dados do book...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxBidSize = Math.max(...depthData.bids.map(b => b.size));
  const maxAskSize = Math.max(...depthData.asks.map(a => a.size));
  const maxSize = Math.max(maxBidSize, maxAskSize);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Book de Ofertas - {symbol}
            </CardTitle>
            <CardDescription>
              Profundidade do mercado em tempo real
            </CardDescription>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Spread</div>
            <Badge variant="outline">
              {depthData.spread.toFixed(4)} ({depthData.spreadPercent.toFixed(3)}%)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Market Data Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Melhor Compra</div>
              <div className="font-medium text-green-600">
                {depthData.bids[0]?.price.toFixed(4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Último Preço</div>
              <div className="font-medium">
                {depthData.lastPrice.toFixed(4)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Melhor Venda</div>
              <div className="font-medium text-red-600">
                {depthData.asks[0]?.price.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Order Book */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asks (Sell Orders) */}
            <div>
              <div className="flex items-center mb-3">
                <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                <h3 className="font-medium text-red-600">Vendas</h3>
              </div>
              
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                  <div>Preço</div>
                  <div className="text-right">Quantidade</div>
                  <div className="text-right">Total</div>
                </div>
                
                {depthData.asks.slice(0, 8).reverse().map((ask, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 bg-red-500/10 rounded"
                         style={{ width: `${(ask.size / maxSize) * 100}%` }} />
                    <div className="relative grid grid-cols-3 gap-2 py-1 px-2 text-sm">
                      <div className="text-red-600 font-medium">
                        {ask.price.toFixed(4)}
                      </div>
                      <div className="text-right">
                        {ask.size.toFixed(0)}
                      </div>
                      <div className="text-right text-muted-foreground">
                        {ask.total.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bids (Buy Orders) */}
            <div>
              <div className="flex items-center mb-3">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                <h3 className="font-medium text-green-600">Compras</h3>
              </div>
              
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                  <div>Preço</div>
                  <div className="text-right">Quantidade</div>
                  <div className="text-right">Total</div>
                </div>
                
                {depthData.bids.slice(0, 8).map((bid, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 bg-green-500/10 rounded"
                         style={{ width: `${(bid.size / maxSize) * 100}%` }} />
                    <div className="relative grid grid-cols-3 gap-2 py-1 px-2 text-sm">
                      <div className="text-green-600 font-medium">
                        {bid.price.toFixed(4)}
                      </div>
                      <div className="text-right">
                        {bid.size.toFixed(0)}
                      </div>
                      <div className="text-right text-muted-foreground">
                        {bid.total.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Volume Distribution */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Distribuição de Volume</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Volume Compras</span>
                <span>{depthData.bids.reduce((sum, bid) => sum + bid.size, 0).toFixed(0)}</span>
              </div>
              <Progress 
                value={(depthData.bids.reduce((sum, bid) => sum + bid.size, 0) / 
                        (depthData.bids.reduce((sum, bid) => sum + bid.size, 0) + 
                         depthData.asks.reduce((sum, ask) => sum + ask.size, 0))) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Volume Vendas</span>
                <span>{depthData.asks.reduce((sum, ask) => sum + ask.size, 0).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
