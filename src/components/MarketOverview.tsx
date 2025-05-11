
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { Asset } from "@/types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const MarketOverview = () => {
  const { assets, fetchChartData } = useMarket();
  
  // Group assets by type
  const assetsByType = useMemo(() => {
    const grouped: Record<string, Asset[]> = {};
    
    assets.forEach(asset => {
      if (!grouped[asset.type]) {
        grouped[asset.type] = [];
      }
      grouped[asset.type].push(asset);
    });
    
    return grouped;
  }, [assets]);
  
  const typeLabels: Record<string, string> = {
    forex: "Forex",
    crypto: "Criptomoedas",
    stock: "Ações",
    commodity: "Commodities",
    index: "Índices",
    bond: "Títulos",
    etf: "ETFs"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(assetsByType).map(([type, assets]) => (
        <Card key={type} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{typeLabels[type] || type}</CardTitle>
              <Badge>{assets.length}</Badge>
            </div>
            <CardDescription>
              Principais ativos desta categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={assets.map(asset => ({
                    name: asset.symbol,
                    value: asset.changePercent
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`colorGradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill={`url(#colorGradient-${type})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <table className="market-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Variação</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 3).map(asset => (
                  <tr key={asset.id}>
                    <td className="font-medium">{asset.symbol}</td>
                    <td>{asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4
                    })}</td>
                    <td className={asset.changePercent >= 0 ? "text-profit" : "text-loss"}>
                      {asset.changePercent >= 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
