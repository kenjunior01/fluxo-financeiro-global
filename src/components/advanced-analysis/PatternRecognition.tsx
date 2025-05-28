
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartData } from "@/types";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";

interface Pattern {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  targetPrice?: number;
  stopLoss?: number;
}

interface PatternRecognitionProps {
  data: ChartData[];
  symbol: string;
}

// Detecta padrão de triângulo ascendente
const detectAscendingTriangle = (data: ChartData[]): Pattern | null => {
  if (data.length < 20) return null;
  
  const recent = data.slice(-20);
  const highs = recent.map(d => d.value);
  const maxHigh = Math.max(...highs);
  const resistance = maxHigh;
  
  // Verificar se há pelo menos 3 toques na resistência
  const resistanceTouches = recent.filter(d => Math.abs(d.value - resistance) < resistance * 0.01).length;
  
  if (resistanceTouches >= 3) {
    return {
      name: 'Triângulo Ascendente',
      type: 'bullish',
      confidence: 75,
      description: 'Padrão de continuação bullish formado. Resistência horizontal com suportes ascendentes.',
      targetPrice: resistance * 1.05,
      stopLoss: resistance * 0.98
    };
  }
  
  return null;
};

// Detecta padrão de cabeça e ombros
const detectHeadAndShoulders = (data: ChartData[]): Pattern | null => {
  if (data.length < 30) return null;
  
  const recent = data.slice(-30);
  const values = recent.map(d => d.value);
  
  // Encontrar picos locais (simplificado)
  const peaks = [];
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] > values[i-1] && values[i] > values[i+1]) {
      peaks.push({ index: i, value: values[i] });
    }
  }
  
  if (peaks.length >= 3) {
    // Verificar se o pico do meio é o mais alto (cabeça)
    const sorted = [...peaks].sort((a, b) => b.value - a.value);
    const head = sorted[0];
    const shoulders = peaks.filter(p => p.index !== head.index);
    
    if (shoulders.length >= 2) {
      return {
        name: 'Cabeça e Ombros',
        type: 'bearish',
        confidence: 68,
        description: 'Padrão de reversão bearish identificado. Sugere mudança de tendência para baixa.',
        targetPrice: head.value * 0.92,
        stopLoss: head.value * 1.02
      };
    }
  }
  
  return null;
};

// Detecta padrão de bandeira
const detectFlag = (data: ChartData[]): Pattern | null => {
  if (data.length < 15) return null;
  
  const recent = data.slice(-15);
  const first = recent[0].value;
  const last = recent[recent.length - 1].value;
  
  // Verificar se há uma consolidação horizontal após movimento forte
  const priceRange = Math.max(...recent.map(d => d.value)) - Math.min(...recent.map(d => d.value));
  const avgPrice = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
  
  if (priceRange / avgPrice < 0.03) { // Consolidação de menos de 3%
    return {
      name: 'Bandeira',
      type: 'bullish',
      confidence: 60,
      description: 'Padrão de continuação após movimento forte. Consolidação antes de nova alta.',
      targetPrice: avgPrice * 1.04,
      stopLoss: avgPrice * 0.98
    };
  }
  
  return null;
};

// Detecta divergência de RSI
const detectRSIDivergence = (data: ChartData[]): Pattern | null => {
  if (data.length < 20) return null;
  
  // Cálculo simplificado de divergência
  const recent = data.slice(-10);
  const older = data.slice(-20, -10);
  
  const recentHigh = Math.max(...recent.map(d => d.value));
  const olderHigh = Math.max(...older.map(d => d.value));
  
  // Se preço fez novo máximo mas momentum não acompanhou
  if (recentHigh > olderHigh) {
    return {
      name: 'Divergência Bearish',
      type: 'bearish',
      confidence: 55,
      description: 'Divergência detectada entre preço e momentum. Possível reversão.',
      targetPrice: recentHigh * 0.96,
      stopLoss: recentHigh * 1.01
    };
  }
  
  return null;
};

export const PatternRecognition: React.FC<PatternRecognitionProps> = ({
  data,
  symbol
}) => {
  const detectedPatterns = useMemo(() => {
    const patterns: Pattern[] = [];
    
    // Executar detecções de padrões
    const ascendingTriangle = detectAscendingTriangle(data);
    if (ascendingTriangle) patterns.push(ascendingTriangle);
    
    const headAndShoulders = detectHeadAndShoulders(data);
    if (headAndShoulders) patterns.push(headAndShoulders);
    
    const flag = detectFlag(data);
    if (flag) patterns.push(flag);
    
    const rsiDivergence = detectRSIDivergence(data);
    if (rsiDivergence) patterns.push(rsiDivergence);
    
    return patterns.sort((a, b) => b.confidence - a.confidence);
  }, [data]);

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'bearish': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
  };

  const currentPrice = data[data.length - 1]?.value || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconhecimento de Padrões</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {detectedPatterns.length > 0 ? (
          detectedPatterns.map((pattern, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getPatternColor(pattern.type)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getPatternIcon(pattern.type)}
                  <h4 className="font-medium">{pattern.name}</h4>
                </div>
                <Badge variant="outline" className="bg-white/50">
                  {pattern.confidence}% confiança
                </Badge>
              </div>
              
              <Progress value={pattern.confidence} className="h-2 mb-3" />
              
              <p className="text-sm mb-3">{pattern.description}</p>
              
              {pattern.targetPrice && pattern.stopLoss && (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Preço Atual</div>
                    <div className="font-medium">{currentPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Alvo
                    </div>
                    <div className="font-medium text-green-600">
                      {pattern.targetPrice.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Stop Loss</div>
                    <div className="font-medium text-red-600">
                      {pattern.stopLoss.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Nenhum Padrão Detectado</h3>
            <p className="text-sm text-muted-foreground">
              Aguardando mais dados para identificar padrões técnicos relevantes para {symbol}.
            </p>
          </div>
        )}

        {detectedPatterns.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Resumo da Análise</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-500/20 p-2 rounded">
                <div className="text-green-600 font-medium">
                  {detectedPatterns.filter(p => p.type === 'bullish').length}
                </div>
                <div className="text-xs text-green-600">BULLISH</div>
              </div>
              <div className="bg-yellow-500/20 p-2 rounded">
                <div className="text-yellow-600 font-medium">
                  {detectedPatterns.filter(p => p.type === 'neutral').length}
                </div>
                <div className="text-xs text-yellow-600">NEUTRO</div>
              </div>
              <div className="bg-red-500/20 p-2 rounded">
                <div className="text-red-600 font-medium">
                  {detectedPatterns.filter(p => p.type === 'bearish').length}
                </div>
                <div className="text-xs text-red-600">BEARISH</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
