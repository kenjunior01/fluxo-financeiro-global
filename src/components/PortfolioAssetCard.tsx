
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Position } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PortfolioAssetCardProps {
  position: Position;
}

export function PortfolioAssetCard({ position }: PortfolioAssetCardProps) {
  const isProfit = position.profit > 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{position.asset.symbol}</h3>
            <p className="text-sm text-muted-foreground">{position.asset.name}</p>
          </div>
          <div className={`flex items-center ${isProfit ? 'text-profit' : 'text-loss'}`}>
            {isProfit ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">{position.profitPercent.toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tipo</span>
            <span className={`text-sm font-medium ${position.type === 'buy' ? 'text-profit' : 'text-loss'}`}>
              {position.type === 'buy' ? 'Compra' : 'Venda'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Valor</span>
            <span className="text-sm font-medium">
              R$ {position.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Alavancagem</span>
            <span className="text-sm font-medium">{position.leverage}x</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Preço de Abertura</span>
            <span className="text-sm font-medium">
              {position.openPrice.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Preço Atual</span>
            <span className="text-sm font-medium">
              {position.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Lucro/Perda</span>
            <span className={`text-sm font-medium ${isProfit ? 'text-profit' : 'text-loss'}`}>
              R$ {position.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between">
        <Button variant="outline" size="sm">Editar</Button>
        <Button variant="destructive" size="sm">Fechar</Button>
      </CardFooter>
    </Card>
  );
}
