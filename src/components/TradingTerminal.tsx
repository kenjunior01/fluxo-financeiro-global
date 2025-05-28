
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMarket } from "@/contexts/MarketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Asset, Position } from "@/types";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield, 
  Zap,
  Calculator
} from "lucide-react";

interface OrderSettings {
  orderType: 'market' | 'limit' | 'stop';
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  limitPrice?: number;
  stopPrice?: number;
}

interface RiskManagement {
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  maxRisk?: number;
}

export function TradingTerminal() {
  const { toast } = useToast();
  const { assets, openPosition } = useMarket();
  const { currentUser } = useAuth();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('100');
  const [leverage, setLeverage] = useState<number>(1);
  const [orderSettings, setOrderSettings] = useState<OrderSettings>({
    orderType: 'market',
    timeInForce: 'GTC'
  });
  const [riskManagement, setRiskManagement] = useState<RiskManagement>({});
  const [useAdvancedRisk, setUseAdvancedRisk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate order details
  const orderDetails = useMemo(() => {
    if (!selectedAsset || !quantity) return null;

    const qty = parseFloat(quantity);
    const price = orderSettings.orderType === 'limit' && orderSettings.limitPrice 
      ? orderSettings.limitPrice 
      : selectedAsset.price;
    
    const notionalValue = qty * price;
    const leveragedValue = notionalValue * leverage;
    const requiredMargin = notionalValue / leverage;
    
    const estimatedFees = notionalValue * 0.001; // 0.1% fee estimate
    
    return {
      notionalValue,
      leveragedValue,
      requiredMargin,
      estimatedFees,
      price
    };
  }, [selectedAsset, quantity, leverage, orderSettings]);

  const handleOrderSubmit = useCallback(async () => {
    if (!currentUser || !selectedAsset || !orderDetails) {
      toast({
        title: "Erro",
        description: "Dados incompletos para executar a ordem",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate order
      if (orderDetails.requiredMargin > 10000) { // Example balance check
        throw new Error("Margem insuficiente para esta operação");
      }

      // Prepare position data
      const positionData: Omit<Position, "id" | "openDate" | "profit" | "profitPercent" | "status" | "currentPrice"> = {
        userId: currentUser.id,
        asset: selectedAsset,
        type: side,
        amount: parseFloat(quantity),
        leverage,
        openPrice: orderDetails.price,
        stopLoss: riskManagement.stopLoss,
        takeProfit: riskManagement.takeProfit,
        isAutomated: false
      };

      const success = await openPosition(positionData);

      if (success) {
        toast({
          title: "Ordem Executada",
          description: `${side === 'buy' ? 'Compra' : 'Venda'} de ${quantity} ${selectedAsset.symbol} executada com sucesso`,
        });

        // Reset form
        setQuantity('100');
        setLeverage(1);
        setRiskManagement({});
      } else {
        throw new Error("Falha na execução da ordem");
      }
    } catch (error) {
      toast({
        title: "Erro na Execução",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, selectedAsset, orderDetails, side, quantity, leverage, riskManagement, openPosition, toast]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Terminal de Trading
        </CardTitle>
        <CardDescription>
          Execute ordens com configurações avançadas de risco
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="order">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="order">Ordem</TabsTrigger>
            <TabsTrigger value="risk">Gestão de Risco</TabsTrigger>
            <TabsTrigger value="preview">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Selection */}
              <div className="space-y-4">
                <div>
                  <Label>Ativo</Label>
                  <Select
                    value={selectedAsset?.symbol || ""}
                    onValueChange={(value) => {
                      const asset = assets.find(a => a.symbol === value);
                      setSelectedAsset(asset || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.symbol}>
                          <div className="flex justify-between items-center w-full">
                            <span>{asset.symbol}</span>
                            <span className={`ml-2 ${asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.price.toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Side Selection */}
                <div>
                  <Label>Operação</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant={side === 'buy' ? 'default' : 'outline'}
                      className={`flex-1 ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={() => setSide('buy')}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Comprar
                    </Button>
                    <Button
                      variant={side === 'sell' ? 'default' : 'outline'}
                      className={`flex-1 ${side === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      onClick={() => setSide('sell')}
                    >
                      <TrendingDown className="mr-2 h-4 w-4" />
                      Vender
                    </Button>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              {/* Order Settings */}
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Ordem</Label>
                  <Select
                    value={orderSettings.orderType}
                    onValueChange={(value: 'market' | 'limit' | 'stop') => 
                      setOrderSettings(prev => ({ ...prev, orderType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Mercado</SelectItem>
                      <SelectItem value="limit">Limitada</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderSettings.orderType === 'limit' && (
                  <div>
                    <Label>Preço Limite</Label>
                    <Input
                      type="number"
                      value={orderSettings.limitPrice || ''}
                      onChange={(e) => setOrderSettings(prev => ({ 
                        ...prev, 
                        limitPrice: parseFloat(e.target.value) 
                      }))}
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <Label>Alavancagem: {leverage}x</Label>
                  <Slider
                    value={[leverage]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setLeverage(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1x</span>
                    <span>50x</span>
                    <span>100x</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={useAdvancedRisk}
                onCheckedChange={setUseAdvancedRisk}
              />
              <Label>Ativar Gestão Avançada de Risco</Label>
            </div>

            {useAdvancedRisk && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Stop Loss</Label>
                    <Input
                      type="number"
                      value={riskManagement.stopLoss || ''}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        stopLoss: parseFloat(e.target.value) 
                      }))}
                      step="0.01"
                      placeholder="Preço de stop loss"
                    />
                  </div>

                  <div>
                    <Label>Take Profit</Label>
                    <Input
                      type="number"
                      value={riskManagement.takeProfit || ''}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        takeProfit: parseFloat(e.target.value) 
                      }))}
                      step="0.01"
                      placeholder="Preço de take profit"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Trailing Stop (%)</Label>
                    <Input
                      type="number"
                      value={riskManagement.trailingStop || ''}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        trailingStop: parseFloat(e.target.value) 
                      }))}
                      step="0.1"
                      placeholder="Percentual trailing stop"
                    />
                  </div>

                  <div>
                    <Label>Risco Máximo (%)</Label>
                    <Input
                      type="number"
                      value={riskManagement.maxRisk || ''}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        maxRisk: parseFloat(e.target.value) 
                      }))}
                      step="0.1"
                      placeholder="% do capital em risco"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {orderDetails && selectedAsset ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="mr-2 h-4 w-4" />
                      Detalhes da Ordem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ativo:</span>
                      <span className="font-medium">{selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operação:</span>
                      <Badge variant={side === 'buy' ? 'default' : 'destructive'}>
                        {side === 'buy' ? 'Compra' : 'Venda'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantidade:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço:</span>
                      <span className="font-medium">{orderDetails.price.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alavancagem:</span>
                      <span className="font-medium">{leverage}x</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Cálculos Financeiros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Valor Nocional:</span>
                      <span className="font-medium">R$ {orderDetails.notionalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor Alavancado:</span>
                      <span className="font-medium">R$ {orderDetails.leveragedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem Requerida:</span>
                      <span className="font-medium">R$ {orderDetails.requiredMargin.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxas Estimadas:</span>
                      <span className="font-medium">R$ {orderDetails.estimatedFees.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {useAdvancedRisk && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Gestão de Risco
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {riskManagement.stopLoss && (
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Stop Loss</div>
                          <div className="font-medium text-red-600">
                            {riskManagement.stopLoss.toFixed(4)}
                          </div>
                        </div>
                      )}
                      {riskManagement.takeProfit && (
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Take Profit</div>
                          <div className="font-medium text-green-600">
                            {riskManagement.takeProfit.toFixed(4)}
                          </div>
                        </div>
                      )}
                      {riskManagement.trailingStop && (
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Trailing Stop</div>
                          <div className="font-medium">
                            {riskManagement.trailingStop}%
                          </div>
                        </div>
                      )}
                      {riskManagement.maxRisk && (
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Risco Máximo</div>
                          <div className="font-medium">
                            {riskManagement.maxRisk}%
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Selecione um ativo e configure a ordem para ver o resumo
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                size="lg"
                disabled={!selectedAsset || !quantity || isSubmitting}
                onClick={handleOrderSubmit}
                className={side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isSubmitting ? 'Executando...' : `Executar ${side === 'buy' ? 'Compra' : 'Venda'}`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
