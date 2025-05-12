
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, CheckCircle, PlayCircle, Plus, Save, Settings2 } from "lucide-react";

interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'reversal' | 'breakout' | 'mean-reversion' | 'custom';
  assets: string[];
  enabled: boolean;
  parameters: {
    timeframe: string;
    entrySignal: string;
    exitSignal: string;
    stopLoss: number;
    takeProfit: number;
  };
  performance?: {
    winRate: number;
    profitFactor: number;
    totalTrades: number;
  };
}

const predefinedStrategies: TradingStrategy[] = [
  {
    id: '1',
    name: 'Cruzamento de Médias Móveis',
    description: 'Estratégia baseada no cruzamento da média móvel de 9 períodos com a média móvel de 21 períodos',
    type: 'momentum',
    assets: ['PETR4.SA', 'VALE3.SA', 'ITUB4.SA'],
    enabled: true,
    parameters: {
      timeframe: '1d',
      entrySignal: 'SMA(9) cruza acima de SMA(21)',
      exitSignal: 'SMA(9) cruza abaixo de SMA(21)',
      stopLoss: 5,
      takeProfit: 15
    },
    performance: {
      winRate: 67.5,
      profitFactor: 1.8,
      totalTrades: 48
    }
  },
  {
    id: '2',
    name: 'RSI Sobrecomprado/Sobrevendido',
    description: 'Estratégia que busca reversões usando o indicador RSI',
    type: 'reversal',
    assets: ['BTCUSD', 'ETHUSD'],
    enabled: false,
    parameters: {
      timeframe: '1h',
      entrySignal: 'RSI(14) < 30',
      exitSignal: 'RSI(14) > 70',
      stopLoss: 8,
      takeProfit: 24
    },
    performance: {
      winRate: 58.2,
      profitFactor: 1.45,
      totalTrades: 67
    }
  }
];

export const TradingStrategies = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<TradingStrategy[]>(predefinedStrategies);
  const [editingStrategy, setEditingStrategy] = useState<TradingStrategy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleToggleStrategy = (id: string) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id ? { ...strategy, enabled: !strategy.enabled } : strategy
    ));
    
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      toast({
        title: `Estratégia ${strategy.enabled ? 'desativada' : 'ativada'}`,
        description: `${strategy.name} foi ${strategy.enabled ? 'desativada' : 'ativada'} com sucesso.`,
      });
    }
  };

  const handleSaveStrategy = () => {
    if (!editingStrategy) return;
    
    if (isCreating) {
      // Add new strategy
      setStrategies([...strategies, { ...editingStrategy, id: Date.now().toString() }]);
      toast({
        title: "Estratégia criada",
        description: `${editingStrategy.name} foi criada com sucesso.`
      });
    } else {
      // Update existing strategy
      setStrategies(strategies.map(strategy => 
        strategy.id === editingStrategy.id ? editingStrategy : strategy
      ));
      toast({
        title: "Estratégia atualizada",
        description: `${editingStrategy.name} foi atualizada com sucesso.`
      });
    }
    
    setEditingStrategy(null);
    setIsCreating(false);
  };

  const handleCreateStrategy = () => {
    setIsCreating(true);
    setEditingStrategy({
      id: '',
      name: '',
      description: '',
      type: 'custom',
      assets: [],
      enabled: false,
      parameters: {
        timeframe: '1d',
        entrySignal: '',
        exitSignal: '',
        stopLoss: 5,
        takeProfit: 10
      }
    });
  };

  const handleEditStrategy = (id: string) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setEditingStrategy({ ...strategy });
      setIsCreating(false);
    }
  };

  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
    toast({
      title: "Estratégia removida",
      description: "A estratégia foi removida com sucesso."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Estratégias de Trading
            </CardTitle>
            <CardDescription>Configure e ative estratégias automáticas de trading</CardDescription>
          </div>
          <Button onClick={handleCreateStrategy} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nova Estratégia
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {editingStrategy ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Estratégia</Label>
                <Input 
                  id="name"
                  value={editingStrategy.name} 
                  onChange={(e) => setEditingStrategy({...editingStrategy, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={editingStrategy.type}
                  onValueChange={(value) => setEditingStrategy({
                    ...editingStrategy, 
                    type: value as 'momentum' | 'reversal' | 'breakout' | 'mean-reversion' | 'custom'
                  })}
                >
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="reversal">Reversão</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="mean-reversion">Reversão à Média</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description"
                  value={editingStrategy.description} 
                  onChange={(e) => setEditingStrategy({...editingStrategy, description: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={editingStrategy.parameters.timeframe}
                  onValueChange={(value) => setEditingStrategy({
                    ...editingStrategy, 
                    parameters: {...editingStrategy.parameters, timeframe: value}
                  })}
                >
                  <SelectTrigger id="timeframe" className="mt-1">
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
              
              <div>
                <Label htmlFor="assets">Ativos</Label>
                <Input 
                  id="assets"
                  placeholder="Ex: PETR4.SA, VALE3.SA" 
                  value={editingStrategy.assets.join(', ')} 
                  onChange={(e) => setEditingStrategy({
                    ...editingStrategy, 
                    assets: e.target.value.split(',').map(a => a.trim())
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="entrySignal">Sinal de Entrada</Label>
                <Input 
                  id="entrySignal"
                  value={editingStrategy.parameters.entrySignal} 
                  onChange={(e) => setEditingStrategy({
                    ...editingStrategy, 
                    parameters: {...editingStrategy.parameters, entrySignal: e.target.value}
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="exitSignal">Sinal de Saída</Label>
                <Input 
                  id="exitSignal"
                  value={editingStrategy.parameters.exitSignal} 
                  onChange={(e) => setEditingStrategy({
                    ...editingStrategy, 
                    parameters: {...editingStrategy.parameters, exitSignal: e.target.value}
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Stop Loss (%)</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Slider
                    value={[editingStrategy.parameters.stopLoss]}
                    min={1}
                    max={20}
                    step={0.5}
                    onValueChange={(values) => setEditingStrategy({
                      ...editingStrategy, 
                      parameters: {...editingStrategy.parameters, stopLoss: values[0]}
                    })}
                  />
                  <span className="w-12 text-right">{editingStrategy.parameters.stopLoss}%</span>
                </div>
              </div>
              
              <div>
                <Label>Take Profit (%)</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Slider
                    value={[editingStrategy.parameters.takeProfit]}
                    min={1}
                    max={50}
                    step={0.5}
                    onValueChange={(values) => setEditingStrategy({
                      ...editingStrategy, 
                      parameters: {...editingStrategy.parameters, takeProfit: values[0]}
                    })}
                  />
                  <span className="w-12 text-right">{editingStrategy.parameters.takeProfit}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setEditingStrategy(null);
                setIsCreating(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveStrategy}>
                <Save className="h-4 w-4 mr-1" />
                Salvar Estratégia
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {strategies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma estratégia configurada
              </div>
            ) : (
              strategies.map((strategy) => (
                <div key={strategy.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {strategy.name}
                        <Badge variant={strategy.enabled ? "default" : "outline"} className="ml-2">
                          {strategy.type === 'momentum' ? 'Momentum' :
                            strategy.type === 'reversal' ? 'Reversão' :
                            strategy.type === 'breakout' ? 'Breakout' :
                            strategy.type === 'mean-reversion' ? 'Reversão à Média' : 'Personalizada'}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                    </div>
                    <Switch 
                      checked={strategy.enabled} 
                      onCheckedChange={() => handleToggleStrategy(strategy.id)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Ativos</h4>
                      <div className="flex flex-wrap gap-1">
                        {strategy.assets.map((asset) => (
                          <Badge key={asset} variant="outline">{asset}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Parâmetros</h4>
                      <div className="text-sm">
                        <p>Timeframe: {strategy.parameters.timeframe}</p>
                        <p>Stop Loss: {strategy.parameters.stopLoss}%</p>
                        <p>Take Profit: {strategy.parameters.takeProfit}%</p>
                      </div>
                    </div>
                    
                    {strategy.performance && (
                      <div>
                        <h4 className="text-xs text-muted-foreground mb-1">Performance</h4>
                        <div className="text-sm">
                          <p>Win Rate: {strategy.performance.winRate}%</p>
                          <p>Profit Factor: {strategy.performance.profitFactor}</p>
                          <p>Total de Trades: {strategy.performance.totalTrades}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditStrategy(strategy.id)}>
                      <Settings2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    {strategy.enabled ? (
                      <Button variant="default" size="sm">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Execução em Tempo Real
                      </Button>
                    ) : (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteStrategy(strategy.id)}>
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
