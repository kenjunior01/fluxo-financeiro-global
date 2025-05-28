
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar } from "lucide-react";

interface PerformanceData {
  date: string;
  portfolio: number;
  benchmark: number;
  returns: number;
}

export function PerformanceDashboard() {
  const [timeframe, setTimeframe] = useState('1M');
  
  const [performanceData] = useState<PerformanceData[]>([
    { date: '01/01', portfolio: 100000, benchmark: 100000, returns: 0 },
    { date: '01/02', portfolio: 101500, benchmark: 100800, returns: 1.5 },
    { date: '01/03', portfolio: 103200, benchmark: 101200, returns: 3.2 },
    { date: '01/04', portfolio: 102800, benchmark: 101800, returns: 2.8 },
    { date: '01/05', portfolio: 105600, benchmark: 102500, returns: 5.6 },
    { date: '01/06', portfolio: 107200, benchmark: 103000, returns: 7.2 },
    { date: '01/07', portfolio: 106800, benchmark: 102800, returns: 6.8 },
  ]);

  const [metrics] = useState({
    totalReturn: 6.8,
    annualizedReturn: 15.2,
    volatility: 18.5,
    maxDrawdown: -4.2,
    winRate: 68.5,
    profitFactor: 1.85,
    alpha: 2.1,
    beta: 1.12
  });

  const [monthlyReturns] = useState([
    { month: 'Jan', returns: 3.2 },
    { month: 'Fev', returns: -1.8 },
    { month: 'Mar', returns: 5.1 },
    { month: 'Abr', returns: 2.4 },
    { month: 'Mai', returns: -0.8 },
    { month: 'Jun', returns: 4.6 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Dashboard de Performance
            </CardTitle>
            <CardDescription>
              Análise detalhada do desempenho da sua carteira
            </CardDescription>
          </div>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1W">1 Semana</SelectItem>
              <SelectItem value="1M">1 Mês</SelectItem>
              <SelectItem value="3M">3 Meses</SelectItem>
              <SelectItem value="6M">6 Meses</SelectItem>
              <SelectItem value="1Y">1 Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="returns">Retornos</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Retorno Total</p>
                      <p className="text-xl font-bold text-green-700">
                        {metrics.totalReturn > 0 ? '+' : ''}{metrics.totalReturn.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Retorno Anualizado</p>
                      <p className="text-xl font-bold text-blue-700">{metrics.annualizedReturn}%</p>
                    </div>
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Volatilidade</p>
                      <p className="text-xl font-bold text-purple-700">{metrics.volatility}%</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Max Drawdown</p>
                      <p className="text-xl font-bold text-orange-700">{metrics.maxDrawdown}%</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evolução da Carteira vs. Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `R$ ${value.toLocaleString('pt-BR')}`,
                        name === 'portfolio' ? 'Carteira' : 'Benchmark'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.winRate}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Fator de Lucro</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.profitFactor}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Alpha</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.alpha}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Beta</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.beta}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retornos Acumulados</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retorno']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="returns" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retornos Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retorno']}
                    />
                    <Bar 
                      dataKey="returns" 
                      fill={(entry: any) => entry.returns >= 0 ? "#10b981" : "#ef4444"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Risco-Retorno</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Índice Sharpe:</span>
                      <span className="font-bold">1.24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Índice Sortino:</span>
                      <span className="font-bold">1.67</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tracking Error:</span>
                      <span className="font-bold">8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Information Ratio:</span>
                      <span className="font-bold">0.85</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas Avançadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>VaR (95%):</span>
                      <span className="font-bold text-red-600">-8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CVaR (95%):</span>
                      <span className="font-bold text-red-600">-12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skewness:</span>
                      <span className="font-bold">-0.23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kurtosis:</span>
                      <span className="font-bold">2.87</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
