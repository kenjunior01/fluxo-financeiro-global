import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMarket } from "@/contexts/MarketContext";
import { ChartData } from "@/types";
import { Activity, TrendingUp } from "lucide-react";
import { AdvancedAnalysisPanel } from './advanced-analysis/AdvancedAnalysisPanel';

type IndicatorType = 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger';

interface IndicatorOption {
  id: IndicatorType;
  label: string;
  description: string;
}

const indicatorOptions: IndicatorOption[] = [
  { id: 'sma', label: 'Média Móvel Simples', description: 'Média aritmética dos preços anteriores' },
  { id: 'ema', label: 'Média Móvel Exponencial', description: 'Média ponderada com mais ênfase em dados recentes' },
  { id: 'rsi', label: 'Índice de Força Relativa', description: 'Indicador de momentum que mede a velocidade e magnitude das variações de preço' },
  { id: 'macd', label: 'MACD', description: 'Convergência/Divergência de Médias Móveis' },
  { id: 'bollinger', label: 'Bandas de Bollinger', description: 'Volatilidade baseada em desvio padrão' },
];

// Mocked indicators data
const generateIndicatorData = (data: ChartData[], type: IndicatorType): number[] => {
  switch (type) {
    case 'sma':
      return data.map((_, i) => {
        if (i < 10) return parseFloat(data[i].value.toFixed(2));
        const values = data.slice(i-10, i).map(d => d.value);
        const sum = values.reduce((acc, val) => acc + val, 0);
        return parseFloat((sum / 10).toFixed(2));
      });
    case 'ema':
      // Simple implementation of EMA
      const k = 2 / (10 + 1);
      let emaValues: number[] = [];
      data.forEach((item, i) => {
        if (i === 0) {
          emaValues.push(item.value);
        } else {
          const ema = item.value * k + emaValues[i-1] * (1-k);
          emaValues.push(parseFloat(ema.toFixed(2)));
        }
      });
      return emaValues;
    case 'rsi':
      // Simplified RSI calculation
      return data.map((_, i) => {
        if (i < 14) return 50; // Default value for not enough data
        const gains = [];
        const losses = [];
        
        for (let j = i-13; j <= i; j++) {
          const change = data[j].value - data[j-1].value;
          if (change >= 0) {
            gains.push(change);
            losses.push(0);
          } else {
            gains.push(0);
            losses.push(Math.abs(change));
          }
        }
        
        const avgGain = gains.reduce((acc, val) => acc + val, 0) / 14;
        const avgLoss = losses.reduce((acc, val) => acc + val, 0) / 14;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        return parseFloat(rsi.toFixed(2));
      });
    case 'macd':
      // Simplified MACD
      const ema12 = generateIndicatorData(data, 'ema');
      const ema26 = generateIndicatorData(data, 'ema');
      return data.map((_, i) => parseFloat((ema12[i] - ema26[i]).toFixed(2)));
    case 'bollinger':
      // Just return the main value for mocked data
      return data.map(d => d.value);
    default:
      return data.map(d => d.value);
  }
};

export const TechnicalAnalysis = () => {
  const { assets, fetchChartData, selectedTimeframe } = useMarket();
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0]?.symbol || '');
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorType[]>(['sma']);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  React.useEffect(() => {
    if (selectedAsset) {
      fetchChartData(selectedAsset, selectedTimeframe).then(data => {
        setChartData(data);
      });
    }
  }, [selectedAsset, selectedTimeframe, fetchChartData]);

  // Transform chart data for visualization with indicators
  const transformedData = chartData.map((point, index) => {
    const dataPoint: Record<string, any> = {
      name: point.time,
      price: point.value
    };
    
    selectedIndicators.forEach(indicator => {
      const indicatorValues = generateIndicatorData(chartData, indicator);
      dataPoint[indicator] = indicatorValues[index];
    });
    
    return dataPoint;
  });

  const toggleIndicator = (indicator: IndicatorType) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Análise Técnica Avançada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Select
                  value={selectedAsset}
                  onValueChange={setSelectedAsset}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Selecione um ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex flex-wrap gap-2">
                  {indicatorOptions.map(indicator => (
                    <button
                      key={indicator.id}
                      onClick={() => toggleIndicator(indicator.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedIndicators.includes(indicator.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                      title={indicator.description}
                    >
                      {indicator.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <Tabs defaultValue="price">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="price">Gráfico de Preço</TabsTrigger>
                  <TabsTrigger value="volume">Volume e Indicadores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="price" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={transformedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                        {selectedIndicators.includes('sma') && (
                          <Line type="monotone" dataKey="sma" stroke="#ff7300" dot={false} />
                        )}
                        {selectedIndicators.includes('ema') && (
                          <Line type="monotone" dataKey="ema" stroke="#82ca9d" dot={false} />
                        )}
                        {selectedIndicators.includes('bollinger') && (
                          <>
                            <Line type="monotone" dataKey="bollinger" stroke="#ffc658" dot={false} />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="volume" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <div className="grid grid-rows-2 h-full">
                        <BarChart data={transformedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="volume" fill="#8884d8" />
                        </BarChart>
                        
                        <LineChart data={transformedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {selectedIndicators.includes('rsi') && (
                            <Line type="monotone" dataKey="rsi" stroke="#ff4757" dot={false} />
                          )}
                          {selectedIndicators.includes('macd') && (
                            <Line type="monotone" dataKey="macd" stroke="#2ed573" dot={false} />
                          )}
                        </LineChart>
                      </div>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium flex items-center mb-2">
                  <Activity className="h-4 w-4 mr-2" />
                  Análise Automatizada
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAsset ? 
                    `O ativo ${selectedAsset} apresenta tendência de alta no curto prazo, com suporte em ${(chartData[0]?.value * 0.95).toFixed(2)} e resistência em ${(chartData[0]?.value * 1.05).toFixed(2)}.` :
                    'Selecione um ativo para ver a análise automatizada.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-1">
        <AdvancedAnalysisPanel
          data={chartData}
          symbol={selectedAsset}
        />
      </div>
    </div>
  );
};
