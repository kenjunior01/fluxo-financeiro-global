
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMarket } from "@/contexts/MarketContext";
import { TickerData } from "@/types";
import { Bell, RefreshCw, TrendingDown, TrendingUp, Timer, Globe, Filter } from "lucide-react";

interface IndexData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export function MarketMonitor() {
  const { toast } = useToast();
  const { tickers, isUpdating, fetchAssets } = useMarket();
  const [marketFilter, setMarketFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("changeDesc");
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // 1 minuto
  
  // Índices de mercado (simulados)
  const [indices, setIndices] = useState<IndexData[]>([
    { name: 'Ibovespa', symbol: 'IBOV', value: 127854.38, change: 1256.84, changePercent: 0.99 },
    { name: 'S&P 500', symbol: 'SPX', value: 5218.72, change: -32.45, changePercent: -0.62 },
    { name: 'Nasdaq', symbol: 'IXIC', value: 16341.23, change: -98.76, changePercent: -0.60 },
    { name: 'DAX', symbol: 'GDAXI', value: 18327.45, change: 125.82, changePercent: 0.69 },
    { name: 'Nikkei 225', symbol: 'N225', value: 38910.67, change: -321.54, changePercent: -0.82 }
  ]);
  
  // Referência para a configuração de atualização automática
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Iniciar atualizações periódicas
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAssets();
        // Atualizar índices simulados com pequenas variações aleatórias
        setIndices(prevIndices => 
          prevIndices.map(index => ({
            ...index,
            change: index.change * (0.95 + Math.random() * 0.1),
            changePercent: index.changePercent * (0.95 + Math.random() * 0.1),
            value: index.value * (1 + (index.changePercent / 100) * (0.9 + Math.random() * 0.2))
          }))
        );
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchAssets]);
  
  // Filtrar e ordenar os tickers
  const filteredTickers = React.useMemo(() => {
    let result = [...tickers];
    
    // Aplicar filtro
    if (marketFilter !== 'all') {
      result = result.filter(ticker => {
        if (marketFilter === 'stocks') return ticker.symbol.includes('.SA') || (!ticker.symbol.includes('USD') && ticker.symbol.length <= 6);
        if (marketFilter === 'crypto') return ticker.symbol.includes('USD');
        if (marketFilter === 'forex') return ticker.symbol.includes('=X');
        return true;
      });
    }
    
    // Aplicar ordenação
    if (sortBy === 'changeDesc') {
      result.sort((a, b) => b.changePercent - a.changePercent);
    } else if (sortBy === 'changeAsc') {
      result.sort((a, b) => a.changePercent - b.changePercent);
    } else if (sortBy === 'symbol') {
      result.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [tickers, marketFilter, sortBy]);
  
  const handleRefresh = () => {
    fetchAssets();
    toast({
      title: "Mercado atualizado",
      description: "Os dados de mercado foram atualizados com sucesso.",
    });
  };
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast({
      title: autoRefresh ? "Atualização automática desativada" : "Atualização automática ativada",
      description: autoRefresh 
        ? "As atualizações automáticas foram desativadas." 
        : "Os dados serão atualizados automaticamente.",
    });
  };
  
  const updateRefreshInterval = (interval: string) => {
    setRefreshInterval(Number(interval));
    toast({
      title: "Intervalo de atualização alterado",
      description: `Os dados serão atualizados a cada ${Number(interval)/1000} segundos.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Monitor de Mercado
            </CardTitle>
            <CardDescription>
              Acompanhe em tempo real os movimentos do mercado
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={refreshInterval.toString()} onValueChange={updateRefreshInterval}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Intervalo de atualização" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">10 segundos</SelectItem>
                <SelectItem value="30000">30 segundos</SelectItem>
                <SelectItem value="60000">1 minuto</SelectItem>
                <SelectItem value="300000">5 minutos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={toggleAutoRefresh} 
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              {autoRefresh ? "Auto: Ligado" : "Auto: Desligado"}
            </Button>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="icon"
              disabled={isUpdating}
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="watch">
          <div className="border-b px-6 flex items-center justify-between">
            <TabsList className="pb-0">
              <TabsTrigger value="watch">Lista de Observação</TabsTrigger>
              <TabsTrigger value="indices">Índices</TabsTrigger>
              <TabsTrigger value="sectors">Setores</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select value={marketFilter} onValueChange={setMarketFilter}>
                <SelectTrigger className="w-[130px] h-8">
                  <div className="flex items-center">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Filtrar" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="stocks">Ações</SelectItem>
                  <SelectItem value="crypto">Cripto</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] h-8">
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Ordenar" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="changeDesc">Maior variação</SelectItem>
                  <SelectItem value="changeAsc">Menor variação</SelectItem>
                  <SelectItem value="symbol">Símbolo</SelectItem>
                  <SelectItem value="priceDesc">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="watch" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-2">
              {filteredTickers.map((ticker: TickerData) => (
                <Card key={ticker.symbol} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{ticker.symbol}</div>
                      <div className={`text-sm font-medium ${ticker.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {ticker.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {ticker.change >= 0 ? '+' : ''}{ticker.change.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${ticker.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {ticker.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {ticker.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTickers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum ativo encontrado com os filtros selecionados.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="indices" className="m-0">
            <div className="p-4 space-y-2">
              {indices.map((index) => (
                <div key={index.symbol} className="flex justify-between items-center p-4 border-b">
                  <div className="flex flex-col">
                    <span className="font-medium">{index.name}</span>
                    <span className="text-xs text-muted-foreground">{index.symbol}</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      {index.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    
                    <div className={`flex items-center gap-1 text-xs ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {index.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sectors" className="m-0">
            <div className="p-4 space-y-4">
              {['Tecnologia', 'Financeiro', 'Energia', 'Consumo', 'Saúde'].map((sector) => (
                <div key={sector} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{sector}</h4>
                    <Badge variant={Math.random() > 0.5 ? "default" : "destructive"}>
                      {(Math.random() * 2 - 1).toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">
                              {['MGLU3', 'WEGE3', 'TOTS3', 'BBAS3', 'PETR4', 'VALE3'][Math.floor(Math.random() * 6)]}
                            </div>
                            <div className={`text-xs ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                              {(Math.random() * 6 - 3).toFixed(2)}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Dados atualizados em {new Date().toLocaleString('pt-BR')}
        </div>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Bell className="h-4 w-4" />
          Criar Alerta
        </Button>
      </CardFooter>
    </Card>
  );
}
