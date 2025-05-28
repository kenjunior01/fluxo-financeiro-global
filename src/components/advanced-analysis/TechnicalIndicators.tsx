
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartData } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TechnicalIndicatorsProps {
  data: ChartData[];
  selectedIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
}

interface IndicatorResult {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

const calculateRSI = (data: ChartData[], period: number = 14): number => {
  if (data.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i].value - data[i - 1].value;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateMACD = (data: ChartData[]): { macd: number; signal: number; histogram: number } => {
  if (data.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  
  // Simplified MACD calculation
  const ema12 = data.slice(-12).reduce((sum, d) => sum + d.value, 0) / 12;
  const ema26 = data.slice(-26).reduce((sum, d) => sum + d.value, 0) / 26;
  const macd = ema12 - ema26;
  
  // Signal line (simplified)
  const signal = macd * 0.9; // Simplified signal calculation
  const histogram = macd - signal;
  
  return { macd, signal, histogram };
};

const calculateBollingerBands = (data: ChartData[], period: number = 20): { upper: number; middle: number; lower: number } => {
  if (data.length < period) return { upper: 0, middle: 0, lower: 0 };
  
  const recent = data.slice(-period);
  const middle = recent.reduce((sum, d) => sum + d.value, 0) / period;
  
  const variance = recent.reduce((sum, d) => sum + Math.pow(d.value - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  
  return {
    upper: middle + (stdDev * 2),
    middle,
    lower: middle - (stdDev * 2)
  };
};

const calculateStochastic = (data: ChartData[], period: number = 14): { k: number; d: number } => {
  if (data.length < period) return { k: 50, d: 50 };
  
  const recent = data.slice(-period);
  const currentPrice = data[data.length - 1].value;
  const highestHigh = Math.max(...recent.map(d => d.value));
  const lowestLow = Math.min(...recent.map(d => d.value));
  
  const k = ((currentPrice - lowestLow) / (highestHigh - lowestLow)) * 100;
  const d = k * 0.9; // Simplified %D calculation
  
  return { k, d };
};

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  data,
  selectedIndicators,
  onToggleIndicator
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('14');

  const indicators = useMemo(() => {
    if (data.length === 0) return [];

    const period = parseInt(selectedTimeframe);
    const results: IndicatorResult[] = [];

    // RSI
    const rsi = calculateRSI(data, period);
    results.push({
      name: 'RSI',
      value: rsi,
      signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral',
      description: `RSI (${period}): ${rsi > 70 ? 'Sobrecomprado' : rsi < 30 ? 'Sobrevendido' : 'Neutro'}`
    });

    // MACD
    const macd = calculateMACD(data);
    results.push({
      name: 'MACD',
      value: macd.macd,
      signal: macd.histogram > 0 ? 'buy' : macd.histogram < 0 ? 'sell' : 'neutral',
      description: `MACD: ${macd.histogram > 0 ? 'Bullish' : macd.histogram < 0 ? 'Bearish' : 'Neutro'}`
    });

    // Bollinger Bands
    const bollinger = calculateBollingerBands(data, period);
    const currentPrice = data[data.length - 1]?.value || 0;
    const bollingerSignal = currentPrice > bollinger.upper ? 'sell' : 
                           currentPrice < bollinger.lower ? 'buy' : 'neutral';
    results.push({
      name: 'Bollinger',
      value: ((currentPrice - bollinger.lower) / (bollinger.upper - bollinger.lower)) * 100,
      signal: bollingerSignal,
      description: `Bollinger: ${bollingerSignal === 'sell' ? 'Próximo da banda superior' : 
                                bollingerSignal === 'buy' ? 'Próximo da banda inferior' : 'Entre as bandas'}`
    });

    // Stochastic
    const stochastic = calculateStochastic(data, period);
    results.push({
      name: 'Stochastic',
      value: stochastic.k,
      signal: stochastic.k > 80 ? 'sell' : stochastic.k < 20 ? 'buy' : 'neutral',
      description: `Stochastic: ${stochastic.k > 80 ? 'Sobrecomprado' : stochastic.k < 20 ? 'Sobrevendido' : 'Neutro'}`
    });

    return results;
  }, [data, selectedTimeframe]);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'bg-green-500/20 text-green-600';
      case 'sell': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Indicadores Técnicos</CardTitle>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="21">21</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedIndicators.includes(indicator.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleIndicator(indicator.name)}
                >
                  {indicator.name}
                </Button>
                {getSignalIcon(indicator.signal)}
              </div>
              <Badge className={getSignalColor(indicator.signal)}>
                {indicator.value.toFixed(2)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{indicator.description}</p>
          </div>
        ))}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Consenso dos Indicadores</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-500/20 p-2 rounded">
              <div className="text-green-600 font-medium">
                {indicators.filter(i => i.signal === 'buy').length}
              </div>
              <div className="text-xs text-green-600">COMPRA</div>
            </div>
            <div className="bg-gray-500/20 p-2 rounded">
              <div className="text-gray-600 font-medium">
                {indicators.filter(i => i.signal === 'neutral').length}
              </div>
              <div className="text-xs text-gray-600">NEUTRO</div>
            </div>
            <div className="bg-red-500/20 p-2 rounded">
              <div className="text-red-600 font-medium">
                {indicators.filter(i => i.signal === 'sell').length}
              </div>
              <div className="text-xs text-red-600">VENDA</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
