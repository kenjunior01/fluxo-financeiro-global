
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { useMarket } from "@/contexts/MarketContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ArrowDownRight, DollarSign, Percent, TrendingUp, Star, StarOff } from "lucide-react";
import { AssetType } from "@/types";
import { PortfolioAssetCard } from "@/components/PortfolioAssetCard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { WatchlistTable } from "@/components/WatchlistTable";

// Mock data for portfolio allocation
const portfolioAllocation = [
  { name: "Ações", value: 45, color: "#3498db" },
  { name: "Criptomoedas", value: 25, color: "#f39c12" },
  { name: "Forex", value: 15, color: "#2ecc71" },
  { name: "Commodities", value: 10, color: "#9b59b6" },
  { name: "Outros", value: 5, color: "#e74c3c" },
];

// Mock data for portfolio performance
const portfolioPerformance = [
  { name: "Jan", value: 1000 },
  { name: "Fev", value: 1200 },
  { name: "Mar", value: 900 },
  { name: "Abr", value: 1500 },
  { name: "Mai", value: 1800 },
  { name: "Jun", value: 2000 },
  { name: "Jul", value: 2200 },
];

// Mock data for asset performance comparison
const assetPerformance = [
  { name: "Jan", PETR4: 5.2, VALE3: 3.1, ITUB4: 4.5 },
  { name: "Fev", PETR4: 5.7, VALE3: 3.5, ITUB4: 4.2 },
  { name: "Mar", PETR4: 5.0, VALE3: 3.0, ITUB4: 3.9 },
  { name: "Abr", PETR4: 5.9, VALE3: 3.6, ITUB4: 4.8 },
  { name: "Mai", PETR4: 6.2, VALE3: 3.9, ITUB4: 5.0 },
  { name: "Jun", PETR4: 6.5, VALE3: 4.2, ITUB4: 5.2 },
];

const Portfolio = () => {
  const { assets, positions } = useMarket();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate total portfolio value
  const totalPortfolioValue = positions
    .filter(p => p.status === "open" && p.userId === currentUser?.id)
    .reduce((total, position) => total + (position.amount * position.leverage), 0);
  
  // Calculate portfolio profit
  const totalProfit = positions
    .filter(p => p.userId === currentUser?.id)
    .reduce((total, position) => total + position.profit, 0);
  
  const profitPercent = totalPortfolioValue > 0 
    ? (totalProfit / totalPortfolioValue) * 100 
    : 0;
  
  // Group positions by asset type
  const positionsByType = positions
    .filter(p => p.status === "open" && p.userId === currentUser?.id)
    .reduce((acc, position) => {
      const type = position.asset.type;
      acc[type] = (acc[type] || 0) + (position.amount * position.leverage);
      return acc;
    }, {} as Record<AssetType, number>);
  
  // Create allocation data
  const allocationData = Object.entries(positionsByType).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
    color: 
      type === 'forex' ? '#3498db' :
      type === 'crypto' ? '#f39c12' :
      type === 'stock' ? '#2ecc71' :
      type === 'commodity' ? '#9b59b6' : '#e74c3c'
  }));
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Portfólio</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="assets">Ativos</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Total do Portfólio</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    R$ {totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor Total Investido
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  {profitPercent >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-profit" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-loss" />
                  )}
                  <h3 className="text-sm font-medium">Lucro/Prejuízo</h3>
                </div>
                <div className="mt-2">
                  <p className={`text-2xl font-bold ${profitPercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                    R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs ${profitPercent >= 0 ? 'text-profit' : 'text-loss'} mt-1`}>
                    {profitPercent.toFixed(2)}% {profitPercent >= 0 ? 'ganho' : 'perda'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Percent className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Posições Abertas</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {positions.filter(p => p.status === "open" && p.userId === currentUser?.id).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de Posições Ativas
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Taxa de Sucesso</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    68%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Operações Lucrativas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução do Portfólio</CardTitle>
                <CardDescription>
                  Desempenho do seu portfólio ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioPerformance}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} name="Valor (R$)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alocação de Ativos</CardTitle>
                <CardDescription>
                  Distribuição dos seus investimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={allocationData.length > 0 ? allocationData : portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(allocationData.length > 0 ? allocationData : portfolioAllocation).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {(allocationData.length > 0 ? allocationData : portfolioAllocation).map((entry) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PortfolioSummary />
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions
              .filter(p => p.status === "open" && p.userId === currentUser?.id)
              .map(position => (
                <PortfolioAssetCard key={position.id} position={position} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist" className="space-y-4">
          <WatchlistTable />
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Ativos</CardTitle>
              <CardDescription>
                Comparação de desempenho dos seus principais ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetPerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PETR4" fill="#3498db" name="PETR4" />
                  <Bar dataKey="VALE3" fill="#2ecc71" name="VALE3" />
                  <Bar dataKey="ITUB4" fill="#e74c3c" name="ITUB4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Classe de Ativo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={portfolioPerformance}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} name="Ações" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Volatilidade</span>
                    <span className="font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sharpe Ratio</span>
                    <span className="font-medium">1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Beta</span>
                    <span className="font-medium">0.85</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Alpha</span>
                    <span className="font-medium">2.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Máx. Drawdown</span>
                    <span className="font-medium">-15.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolio;
