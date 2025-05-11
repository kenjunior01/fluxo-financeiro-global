
import { useState, useEffect } from "react";
import { useMarket } from "@/contexts/MarketContext";
import { Loader2 } from "lucide-react";

export const PriceTickerBar = () => {
  const { tickers, isLoading } = useMarket();
  const [animatedTickers, setAnimatedTickers] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Add animation classes for price changes
    const newAnimations: Record<string, string> = {};
    
    tickers.forEach(ticker => {
      if (ticker.change > 0) {
        newAnimations[ticker.symbol] = "animate-value-increase";
      } else if (ticker.change < 0) {
        newAnimations[ticker.symbol] = "animate-value-decrease";
      }
    });
    
    // Set animations
    setAnimatedTickers(newAnimations);
    
    // Clear animations after they've played
    const timer = setTimeout(() => {
      setAnimatedTickers({});
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [tickers]);
  
  return (
    <div className="bg-secondary/50 p-2 overflow-hidden w-full border-b border-secondary">
      {isLoading ? (
        <div className="flex justify-center items-center py-1">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Carregando dados do mercado...</span>
        </div>
      ) : (
        <div className="flex animate-slide space-x-6 whitespace-nowrap">
          {tickers.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center space-x-2">
              <span className="font-medium">{ticker.symbol}</span>
              <span 
                className={animatedTickers[ticker.symbol] || ""}
              >
                {ticker.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
              <span 
                className={ticker.change >= 0 ? "text-profit" : "text-loss"}
              >
                {ticker.change >= 0 ? "+" : ""}{ticker.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
