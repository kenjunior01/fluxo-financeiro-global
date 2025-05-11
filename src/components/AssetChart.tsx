
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { Asset } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AssetChartProps {
  asset: Asset;
}

export const AssetChart = ({ asset }: AssetChartProps) => {
  const { fetchChartData, availableTimeframes, selectedTimeframe, setSelectedTimeframe } = useMarket();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChartData(asset.symbol, selectedTimeframe);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChartData();
  }, [asset.symbol, selectedTimeframe, fetchChartData]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // For daily timeframe, show hours
    if (selectedTimeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // For weekly and monthly timeframes, show short date
    if (selectedTimeframe === '1w' || selectedTimeframe === '1m') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // For longer timeframes, show month and year
    return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
  };
  
  const priceChange = chartData.length >= 2 
    ? chartData[chartData.length - 1]?.value - chartData[0]?.value 
    : 0;
    
  const priceChangePercent = chartData.length >= 2 && chartData[0]?.value
    ? (priceChange / chartData[0]?.value) * 100
    : 0;
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{asset.name} ({asset.symbol})</CardTitle>
              <Badge variant={asset.changePercent >= 0 ? "outline" : "destructive"} className={asset.changePercent >= 0 ? "text-profit" : "text-loss"}>
                {asset.changePercent >= 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
              </Badge>
            </div>
            <CardDescription>
              Preço atual: {asset.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {availableTimeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={timeframe.value === selectedTimeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.value)}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-96 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse-subtle text-muted-foreground">
              Carregando dados do gráfico...
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatDate}
                dy={10}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))' 
                }}
                formatter={(value: number) => [value.toFixed(2), 'Preço']}
                labelFormatter={(label) => formatDate(label)}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {!isLoading && (
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Variação no período</span>
              <span className={priceChange >= 0 ? "text-profit" : "text-loss"}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} 
                ({priceChangePercent >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground">Volume</span>
              <span>{asset.volume.toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
