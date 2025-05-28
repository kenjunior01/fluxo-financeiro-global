
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

interface RiskMetric {
  name: string;
  value: number;
  level: 'low' | 'medium' | 'high';
  description: string;
}

export function RiskAnalysis() {
  const [riskMetrics] = useState<RiskMetric[]>([
    {
      name: 'Exposição por Setor',
      value: 65,
      level: 'medium',
      description: 'Concentração em poucos setores'
    },
    {
      name: 'Volatilidade da Carteira',
      value: 78,
      level: 'high',
      description: 'Alta volatilidade detectada'
    },
    {
      name: 'Diversificação',
      value: 45,
      level: 'medium',
      description: 'Carteira pouco diversificada'
    },
    {
      name: 'Liquidez',
      value: 85,
      level: 'low',
      description: 'Boa liquidez geral'
    }
  ]);

  const [portfolioRisk] = useState({
    overall: 68,
    var95: 125000,
    maxDrawdown: 15.2,
    sharpeRatio: 1.35,
    beta: 1.12
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'N/A';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Análise de Risco
        </CardTitle>
        <CardDescription>
          Avaliação completa dos riscos da sua carteira de investimentos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Risco Geral da Carteira</p>
                      <p className="text-2xl font-bold text-blue-700">{portfolioRisk.overall}%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">VaR (95%)</p>
                      <p className="text-2xl font-bold text-purple-700">
                        R$ {portfolioRisk.var95.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              {riskMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge className={getRiskColor(metric.level)}>
                      {getRiskLabel(metric.level)}
                    </Badge>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Índice Sharpe</p>
                  <p className="text-xl font-bold">{portfolioRisk.sharpeRatio}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-xl font-bold">{portfolioRisk.maxDrawdown}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Beta</p>
                  <p className="text-xl font-bold">{portfolioRisk.beta}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição de Risco por Ativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3'].map((symbol, index) => {
                    const riskValue = [25, 20, 18, 15, 12][index];
                    return (
                      <div key={symbol} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{symbol}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={riskValue} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{riskValue}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Alta Concentração em Petróleo</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Sua carteira tem exposição significativa ao setor petrolífero. Consider diversificar em outros setores.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Rebalanceamento Sugerido</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Recomendamos reduzir posições em PETR4 e aumentar exposição em tecnologia e saúde.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Stop Loss Recomendado</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Configure stop loss em 5% para limitar perdas em posições de maior risco.
                      </p>
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
