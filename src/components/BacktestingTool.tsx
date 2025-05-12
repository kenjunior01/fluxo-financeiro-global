
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownToLine, ArrowUpToLine, Clock, History, PlaySquare, Trophy } from "lucide-react";

interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  tradesCount: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  maxDrawdownPercentage: number;
  trades: {
    date: string;
    type: 'buy' | 'sell';
    price: number;
    size: number;
    pnl: number;
  }[];
  equityCurve: {
    date: string;
    equity: number;
  }[];
  monthlyPerformance: {
    month: string;
    performance: number;
  }[];
}

const mockBacktestResult: BacktestResult = {
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  initialBalance: 10000,
  finalBalance: 13650,
  profit: 3650,
  profitPercentage: 36.5,
  tradesCount: 42,
  winningTrades: 28,
  losingTrades: 14,
  winRate: 66.67,
  avgWin: 210.71,
  avgLoss: 150.0,
  profitFactor: 2.8,
  maxDrawdown: 850,
  maxDrawdownPercentage: 8.5,
  trades: [
    { date: '2023-01-15', type: 'buy', price: 142.5, size: 10, pnl: 320 },
    { date: '2023-02-05', type: 'sell', price: 148.2, size: 10, pnl: -150 },
    { date: '2023-03-10', type: 'buy', price: 138.7, size: 12, pnl: 440 }
    // More trades would be here in real implementation
  ],
  equityCurve: Array(12).fill(0).map((_, i) => ({
    date: `2023-${String(i + 1).padStart(2, '0')}-01`,
    equity: 10000 * (1 + 0.36 * (i / 11)) + Math.random() * 500 - 250
  })),
  monthlyPerformance: [
    { month: 'Jan', performance: 3.2 },
    { month: 'Feb', performance: -1.5 },
    { month: 'Mar', performance: 4.7 },
    { month: 'Apr', performance: 2.3 },
    { month: 'May', performance: 5.1 },
    { month: 'Jun', performance: -0.8 },
    { month: 'Jul', performance: 3.9 },
    { month: 'Aug', performance: 4.2 },
    { month: 'Sep', performance: -2.1 },
    { month: 'Oct', performance: 6.3 },
    { month: 'Nov', performance: 3.7 },
    { month: 'Dec', performance: 4.9 }
  ]
};

export const BacktestingTool = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [initialBalance, setInitialBalance] = useState(10000);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  
  const runBacktest = () => {
    if (!selectedStrategy || !selectedAsset || !startDate || !endDate) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos antes de executar o backtest.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setBacktestResult(mockBacktestResult);
      setIsRunning(false);
      toast({
        title: "Backtest concluído",
        description: "Os resultados do backtest estão disponíveis para análise."
      });
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Backtesting
        </CardTitle>
        <CardDescription>Teste suas estratégias com dados históricos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Backtest Form */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-base font-medium mb-4">Configurar Backtest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategy">Estratégia</Label>
                <Select
                  value={selectedStrategy}
                  onValueChange={setSelectedStrategy}
                >
                  <SelectTrigger id="strategy" className="mt-1">
                    <SelectValue placeholder="Selecione uma estratégia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sma-crossover">Cruzamento de Médias Móveis</SelectItem>
                    <SelectItem value="rsi-reversal">RSI Sobrecomprado/Sobrevendido</SelectItem>
                    <SelectItem value="breakout-strategy">Breakout de Canais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="asset">Ativo</Label>
                <Select
                  value={selectedAsset}
                  onValueChange={setSelectedAsset}
                >
                  <SelectTrigger id="asset" className="mt-1">
                    <SelectValue placeholder="Selecione um ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETR4.SA">PETR4.SA - Petrobras</SelectItem>
                    <SelectItem value="VALE3.SA">VALE3.SA - Vale</SelectItem>
                    <SelectItem value="BTCUSD">BTCUSD - Bitcoin</SelectItem>
                    <SelectItem value="ETHUSD">ETHUSD - Ethereum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Data de Início</Label>
                <div className="mt-1">
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
              </div>
              
              <div>
                <Label>Data de Término</Label>
                <div className="mt-1">
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="initialBalance">Saldo Inicial</Label>
                <Input 
                  id="initialBalance"
                  type="number" 
                  value={initialBalance} 
                  onChange={(e) => setInitialBalance(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={runBacktest} disabled={isRunning} className="w-full mt-1">
                  {isRunning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <PlaySquare className="h-4 w-4 mr-2" />
                      Executar Backtest
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Backtest Results */}
          {backtestResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Resultado</p>
                        <h3 className={`text-2xl font-bold ${backtestResult.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {backtestResult.profitPercentage.toFixed(2)}%
                        </h3>
                      </div>
                      {backtestResult.profit >= 0 ? (
                        <ArrowUpToLine className="h-8 w-8 text-green-500" />
                      ) : (
                        <ArrowDownToLine className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(backtestResult.profit)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                    <h3 className="text-2xl font-bold">{backtestResult.winRate.toFixed(1)}%</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {backtestResult.winningTrades} ganhos / {backtestResult.losingTrades} perdas
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Profit Factor</p>
                    <h3 className="text-2xl font-bold">{backtestResult.profitFactor.toFixed(2)}x</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Média Ganho: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(backtestResult.avgWin)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Drawdown Máximo</p>
                    <h3 className="text-2xl font-bold">{backtestResult.maxDrawdownPercentage.toFixed(2)}%</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(backtestResult.maxDrawdown)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="equity">
                <TabsList className="grid grid-cols-3 md:w-[400px]">
                  <TabsTrigger value="equity">Curva de Patrimônio</TabsTrigger>
                  <TabsTrigger value="monthly">Performance Mensal</TabsTrigger>
                  <TabsTrigger value="trades">Operações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="equity" className="mt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={backtestResult.equityCurve}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return `${d.getMonth() + 1}/${d.getFullYear().toString().substr(2)}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [
                            `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            "Patrimônio"
                          ]}
                          labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="equity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={backtestResult.monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Retorno"]} />
                        <Legend />
                        <Bar 
                          dataKey="performance" 
                          fill={(data) => data > 0 ? "#22c55e" : "#ef4444"}
                          name="Retorno Mensal" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="trades" className="mt-4">
                  <div className="bg-card rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Data</th>
                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Tipo</th>
                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Preço</th>
                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Quantidade</th>
                            <th className="px-4 py-2 text-right font-medium text-muted-foreground">P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backtestResult.trades.map((trade, index) => (
                            <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                              <td className="px-4 py-2">{new Date(trade.date).toLocaleDateString('pt-BR')}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 text-xs rounded ${trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {trade.type === 'buy' ? 'Compra' : 'Venda'}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {trade.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                              <td className="px-4 py-2">{trade.size}</td>
                              <td className={`px-4 py-2 text-right ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trade.pnl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="flex items-center text-base font-medium mb-3">
                  <Trophy className="h-5 w-5 mr-2" />
                  Análise de Desempenho
                </h3>
                <p className="text-sm text-muted-foreground">
                  A estratégia "Cruzamento de Médias Móveis" demonstra resultados positivos consistentes, com um retorno de {backtestResult.profitPercentage.toFixed(2)}% 
                  durante o período analisado, superando o benchmark de mercado em 15.2%. O win rate de {backtestResult.winRate.toFixed(1)}% e 
                  o profit factor de {backtestResult.profitFactor.toFixed(2)} indicam uma estratégia robusta. 
                  O drawdown máximo de {backtestResult.maxDrawdownPercentage.toFixed(2)}% está dentro dos limites esperados para este tipo de estratégia.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
