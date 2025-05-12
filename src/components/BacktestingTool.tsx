
import React, { useState } from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { Download, Calendar, CreditCard, DollarSign, HardDrive, Info, LineChart as LineChartIcon, Save, Settings } from 'lucide-react';

// Interface para os resultados do backtest
interface BacktestResult {
  date: string;
  return: number;
  equity: number;
  trade?: {
    type: 'buy' | 'sell';
    price: number;
    size: number;
  };
}

// Interface para estatísticas de desempenho
interface PerformanceStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageProfit: number;
  averageLoss: number;
}

const BacktestingTool = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 365)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [symbol, setSymbol] = useState<string>('PETR4.SA');
  const [strategy, setStrategy] = useState<string>('SMA');
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [leverage, setLeverage] = useState<number>(1);
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("returns");

  // Parâmetros customizáveis da estratégia
  const [params, setParams] = useState({
    fastPeriod: 9,
    slowPeriod: 21,
    signalPeriod: 9,
    stopLoss: 5,
    takeProfit: 15
  });

  const handleParamChange = (paramName: keyof typeof params, value: number) => {
    setParams({
      ...params,
      [paramName]: value
    });
  };

  const handleBacktest = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Datas inválidas",
        description: "Selecione datas válidas para iniciar e finalizar o backtest",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulação de backtest com resultados mais realistas
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const numPoints = Math.min(totalDays, 250); // Limitar a 250 pontos para melhor visualização
      
      let equity = initialCapital;
      let previousEquity = initialCapital;
      let mockResults: BacktestResult[] = [];
      
      // Adicionar uma tendência com alguma aleatoriedade
      const trend = Math.random() > 0.5 ? 0.0002 : -0.0002; // Tendência leve para cima ou para baixo
      
      for (let i = 0; i < numPoints; i++) {
        const dayOffset = Math.floor(i * totalDays / numPoints);
        const currentDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        
        // Gerar retorno diário - mais realista com média próxima de zero e volatilidade controlada
        const dailyReturn = trend + (Math.random() * 0.03 - 0.015) * leverage;
        
        // Atualizar equity
        equity = equity * (1 + dailyReturn);
        
        // Adicionar operações em alguns pontos
        const hasTrade = Math.random() > 0.9; // 10% de chance de ter uma operação no dia
        const tradeInfo = hasTrade ? {
          type: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
          price: equity / 10 * (0.9 + Math.random() * 0.2),
          size: Math.floor(Math.random() * 100) + 1
        } : undefined;
        
        mockResults.push({
          date: currentDate.toLocaleDateString('pt-BR'),
          return: dailyReturn * 100, // Em porcentagem
          equity: equity,
          trade: tradeInfo
        });
        
        previousEquity = equity;
      }
      
      // Calcular estatísticas de desempenho
      const trades = mockResults.filter(r => r.trade).length;
      const winningTrades = mockResults.filter(r => r.return > 0).length;
      const winRate = trades > 0 ? (winningTrades / trades) * 100 : 0;
      
      const returns = mockResults.map(r => r.return);
      const positiveReturns = returns.filter(r => r > 0);
      const negativeReturns = returns.filter(r => r < 0);
      
      const averageProfit = positiveReturns.length > 0 ? 
        positiveReturns.reduce((sum, r) => sum + r, 0) / positiveReturns.length : 0;
      
      const averageLoss = negativeReturns.length > 0 ?
        Math.abs(negativeReturns.reduce((sum, r) => sum + r, 0) / negativeReturns.length) : 0;
      
      const profitFactor = averageLoss > 0 ? averageProfit / averageLoss : 0;
      
      // Calcular maximum drawdown
      let maxDrawdown = 0;
      let peak = initialCapital;
      
      for (const result of mockResults) {
        if (result.equity > peak) {
          peak = result.equity;
        }
        
        const drawdown = (peak - result.equity) / peak * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
      
      // Simular Sharpe ratio
      const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const stdDev = Math.sqrt(returns.map(r => Math.pow(r - meanReturn, 2)).reduce((sum, val) => sum + val, 0) / returns.length);
      const sharpeRatio = stdDev > 0 ? meanReturn / stdDev : 0;
      
      setPerformanceStats({
        totalTrades: trades,
        winRate: winRate,
        profitFactor: profitFactor,
        sharpeRatio: sharpeRatio,
        maxDrawdown: maxDrawdown,
        averageProfit: averageProfit,
        averageLoss: averageLoss
      });
      
      setBacktestResults(mockResults);
      
      toast({
        title: "Backtest concluído",
        description: `Backtest executado com sucesso para ${symbol} no período selecionado.`,
      });
    } catch (error) {
      console.error("Erro ao executar backtest:", error);
      toast({
        title: "Erro no backtest",
        description: "Ocorreu um erro ao executar o backtest. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStrategy = () => {
    // Simulação de salvamento da estratégia
    toast({
      title: "Estratégia salva",
      description: `A estratégia ${strategy} para ${symbol} foi salva com sucesso.`,
    });
  };

  const handleExportResults = () => {
    // Simulação de exportação de resultados
    const dataStr = JSON.stringify(backtestResults, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backtest-${symbol}-${strategy}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Resultados exportados",
      description: "Os resultados do backtest foram exportados com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Backtesting</CardTitle>
          <CardDescription>Simule estratégias de negociação com dados históricos</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="symbol">Ativo</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger id="symbol" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PETR4.SA">PETR4 - Petrobras</SelectItem>
                  <SelectItem value="VALE3.SA">VALE3 - Vale</SelectItem>
                  <SelectItem value="ITUB4.SA">ITUB4 - Itaú</SelectItem>
                  <SelectItem value="BBDC4.SA">BBDC4 - Bradesco</SelectItem>
                  <SelectItem value="ABEV3.SA">ABEV3 - Ambev</SelectItem>
                  <SelectItem value="BTCUSD">BTC/USD - Bitcoin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strategy">Estratégia</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma estratégia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">Média Móvel Simples (SMA)</SelectItem>
                  <SelectItem value="EMA">Média Móvel Exponencial (EMA)</SelectItem>
                  <SelectItem value="MACD">MACD</SelectItem>
                  <SelectItem value="RSI">Índice de Força Relativa (RSI)</SelectItem>
                  <SelectItem value="BB">Bandas de Bollinger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 minuto</SelectItem>
                  <SelectItem value="5m">5 minutos</SelectItem>
                  <SelectItem value="15m">15 minutos</SelectItem>
                  <SelectItem value="1h">1 hora</SelectItem>
                  <SelectItem value="1d">1 dia</SelectItem>
                  <SelectItem value="1w">1 semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            {showAdvancedSettings ? 'Ocultar configurações avançadas' : 'Mostrar configurações avançadas'}
          </Button>

          {showAdvancedSettings && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-2 border-t border-b">
                <div>
                  <Label htmlFor="initialCapital">Capital Inicial (R$)</Label>
                  <Input 
                    id="initialCapital" 
                    type="number" 
                    value={initialCapital} 
                    onChange={(e) => setInitialCapital(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label>Alavancagem ({leverage}x)</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Slider 
                      value={[leverage]} 
                      min={1} 
                      max={10} 
                      step={1} 
                      onValueChange={(values) => setLeverage(values[0])} 
                    />
                    <span className="w-8 text-center">{leverage}x</span>
                  </div>
                </div>

                <div>
                  <Label>Stop Loss ({params.stopLoss}%)</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Slider 
                      value={[params.stopLoss]} 
                      min={1} 
                      max={20} 
                      step={0.5} 
                      onValueChange={(values) => handleParamChange('stopLoss', values[0])} 
                    />
                    <span className="w-8 text-center">{params.stopLoss}%</span>
                  </div>
                </div>

                <div>
                  <Label>Take Profit ({params.takeProfit}%)</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Slider 
                      value={[params.takeProfit]} 
                      min={1} 
                      max={50} 
                      step={0.5} 
                      onValueChange={(values) => handleParamChange('takeProfit', values[0])} 
                    />
                    <span className="w-8 text-center">{params.takeProfit}%</span>
                  </div>
                </div>

                {strategy === 'SMA' && (
                  <>
                    <div>
                      <Label>Período Curto ({params.fastPeriod})</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Slider 
                          value={[params.fastPeriod]} 
                          min={2} 
                          max={50} 
                          step={1} 
                          onValueChange={(values) => handleParamChange('fastPeriod', values[0])} 
                        />
                        <span className="w-8 text-center">{params.fastPeriod}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Período Longo ({params.slowPeriod})</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Slider 
                          value={[params.slowPeriod]} 
                          min={5} 
                          max={200} 
                          step={1} 
                          onValueChange={(values) => handleParamChange('slowPeriod', values[0])} 
                        />
                        <span className="w-8 text-center">{params.slowPeriod}</span>
                      </div>
                    </div>
                  </>
                )}

                {strategy === 'MACD' && (
                  <>
                    <div>
                      <Label>Período Rápido ({params.fastPeriod})</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Slider 
                          value={[params.fastPeriod]} 
                          min={2} 
                          max={50} 
                          step={1} 
                          onValueChange={(values) => handleParamChange('fastPeriod', values[0])} 
                        />
                        <span className="w-8 text-center">{params.fastPeriod}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Período Lento ({params.slowPeriod})</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Slider 
                          value={[params.slowPeriod]} 
                          min={5} 
                          max={100} 
                          step={1} 
                          onValueChange={(values) => handleParamChange('slowPeriod', values[0])} 
                        />
                        <span className="w-8 text-center">{params.slowPeriod}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Período do Sinal ({params.signalPeriod})</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Slider 
                          value={[params.signalPeriod]} 
                          min={2} 
                          max={50} 
                          step={1} 
                          onValueChange={(values) => handleParamChange('signalPeriod', values[0])} 
                        />
                        <span className="w-8 text-center">{params.signalPeriod}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleBacktest} disabled={isLoading} className="flex-1">
              {isLoading ? 'Processando...' : 'Executar Backtest'}
            </Button>
            
            {backtestResults.length > 0 && (
              <>
                <Button onClick={handleSaveStrategy} variant="outline" className="flex items-center gap-2">
                  <Save size={16} />
                  Salvar Estratégia
                </Button>
                
                <Button onClick={handleExportResults} variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Exportar Resultados
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {backtestResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Backtest</CardTitle>
            <CardDescription>Desempenho da estratégia {strategy} em {symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <p className="text-sm font-medium">Capital Final</p>
                    </div>
                    <p className="text-2xl font-bold">
                      R$ {backtestResults[backtestResults.length - 1].equity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Inicial: R$ {initialCapital.toLocaleString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <LineChartIcon size={16} />
                      <p className="text-sm font-medium">Retorno Total</p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      backtestResults[backtestResults.length - 1].equity > initialCapital ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {(((backtestResults[backtestResults.length - 1].equity / initialCapital) - 1) * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Período: {backtestResults.length} dias
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <p className="text-sm font-medium">Operações</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {performanceStats.totalTrades}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Win Rate: {performanceStats.winRate.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <p className="text-sm font-medium">Profit Factor</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {performanceStats.profitFactor.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drawdown Máx: {performanceStats.maxDrawdown.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="returns">Retornos</TabsTrigger>
                <TabsTrigger value="equity">Curva de Capital</TabsTrigger>
              </TabsList>
              
              <TabsContent value="returns" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={backtestResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Retorno']} />
                    <Legend />
                    <Bar dataKey="return" fill="#8884d8" name="Retorno Diário (%)">
                      {backtestResults.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.return > 0 ? "#22c55e" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="equity" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={backtestResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`, 'Capital']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#8884d8" 
                      name="Capital (R$)" 
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
            
            {activeTab === "returns" && performanceStats && (
              <div className="mt-4 bg-muted p-4 rounded-md flex items-center gap-2">
                <Info size={16} className="text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Média de ganho: <span className="text-green-500">{performanceStats.averageProfit.toFixed(2)}%</span> | 
                  Média de perda: <span className="text-red-500">{performanceStats.averageLoss.toFixed(2)}%</span> | 
                  Sharpe Ratio: {performanceStats.sharpeRatio.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <HardDrive size={14} />
                <span>Os resultados são simulados e não representam retornos reais de investimento.</span>
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BacktestingTool;
