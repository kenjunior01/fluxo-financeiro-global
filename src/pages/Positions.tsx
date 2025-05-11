
import { useState } from "react";
import { PositionsTable } from "@/components/PositionsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarket } from "@/contexts/MarketContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Asset, Position } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";

const Positions = () => {
  const { assets, openPosition } = useMarket();
  const { currentUser } = useAuth();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("1000");
  const [leverage, setLeverage] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para abrir posições",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedAsset) {
      toast({
        title: "Ativo não selecionado",
        description: "Selecione um ativo para abrir uma posição",
        variant: "destructive"
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para a posição",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const positionData: Omit<Position, "id" | "openDate" | "profit" | "profitPercent" | "status" | "currentPrice"> = {
        userId: currentUser.id,
        asset: selectedAsset,
        type: orderType,
        amount: amountValue,
        leverage,
        openPrice: selectedAsset.price,
        stopLoss: orderType === "buy" 
          ? selectedAsset.price * 0.98 
          : selectedAsset.price * 1.02,
        takeProfit: orderType === "buy" 
          ? selectedAsset.price * 1.03 
          : selectedAsset.price * 0.97,
        isAutomated: false
      };
      
      const success = await openPosition(positionData);
      
      if (success) {
        toast({
          title: "Posição aberta",
          description: `${orderType === "buy" ? "Compra" : "Venda"} de ${selectedAsset.symbol} realizada com sucesso`
        });
        
        // Reset form
        setSelectedAsset(null);
        setAmount("1000");
        setLeverage(5);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível abrir a posição",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Posições</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Abrir Nova Posição</CardTitle>
            <CardDescription>
              Configure os parâmetros para abrir uma nova posição de trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ativo</label>
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
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Ordem</label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={orderType === "buy" ? "default" : "outline"}
                    className={`flex-1 ${orderType === "buy" ? "bg-profit hover:bg-profit-hover" : ""}`}
                    onClick={() => setOrderType("buy")}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Compra
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === "sell" ? "default" : "outline"}
                    className={`flex-1 ${orderType === "sell" ? "bg-loss hover:bg-loss-hover" : ""}`}
                    onClick={() => setOrderType("sell")}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Venda
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Alavancagem: {leverage}x</label>
                </div>
                <Slider
                  value={[leverage]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setLeverage(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1x</span>
                  <span>25x</span>
                  <span>50x</span>
                  <span>100x</span>
                </div>
              </div>
              
              {selectedAsset && (
                <div className="bg-secondary/50 p-3 rounded-md text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Preço atual:</span>
                    <span className="font-medium">{selectedAsset.price.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor total:</span>
                    <span className="font-medium">{parseFloat(amount || "0").toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor com alavancagem:</span>
                    <span className="font-medium">{(parseFloat(amount || "0") * leverage).toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !selectedAsset}
              >
                {isSubmitting ? "Processando..." : "Abrir Posição"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <PositionsTable />
        </div>
      </div>
    </div>
  );
};

export default Positions;
