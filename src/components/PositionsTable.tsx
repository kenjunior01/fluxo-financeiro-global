
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Position } from "@/types";
import { ArrowDown, ArrowUp, Server } from "lucide-react";

export const PositionsTable = () => {
  const { positions, closePosition } = useMarket();
  const { currentUser } = useAuth();
  const [isClosing, setIsClosing] = useState<Record<string, boolean>>({});
  
  const openPositions = useMemo(() => 
    positions.filter(position => position.status === "open"),
    [positions]
  );
  
  const closedPositions = useMemo(() => 
    positions.filter(position => position.status === "closed"),
    [positions]
  );
  
  const totalProfit = useMemo(() => 
    openPositions.reduce((sum, position) => sum + position.profit, 0),
    [openPositions]
  );
  
  const handleClosePosition = async (positionId: string) => {
    setIsClosing(prev => ({ ...prev, [positionId]: true }));
    
    try {
      await closePosition(positionId);
    } finally {
      setIsClosing(prev => ({ ...prev, [positionId]: false }));
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Posições Ativas</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={totalProfit >= 0 ? "default" : "destructive"}>
              Total: {totalProfit >= 0 ? "+" : ""}{totalProfit.toFixed(2)}
            </Badge>
            <Badge variant="outline">{openPositions.length} posições</Badge>
          </div>
        </div>
        <CardDescription>
          Todas as posições de trading abertas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {openPositions.length > 0 ? (
          <div className="overflow-auto max-h-96">
            <table className="market-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Tipo</th>
                  <th>Preço Entrada</th>
                  <th>Preço Atual</th>
                  <th>Tamanho</th>
                  <th>Alavancagem</th>
                  <th>P/L</th>
                  <th>Auto</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((position) => (
                  <tr key={position.id}>
                    <td className="font-medium">{position.asset.symbol}</td>
                    <td>
                      <Badge variant={position.type === 'buy' ? 'default' : 'destructive'}>
                        {position.type === 'buy' ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {position.type === 'buy' ? 'Compra' : 'Venda'}
                      </Badge>
                    </td>
                    <td>{position.openPrice.toFixed(2)}</td>
                    <td>{position.currentPrice.toFixed(2)}</td>
                    <td>{position.amount.toLocaleString()}</td>
                    <td>x{position.leverage}</td>
                    <td className={position.profit >= 0 ? "text-profit" : "text-loss"}>
                      <div>{position.profit >= 0 ? "+" : ""}{position.profit.toFixed(2)}</div>
                      <div className="text-xs opacity-80">
                        ({position.profitPercent >= 0 ? "+" : ""}{position.profitPercent.toFixed(2)}%)
                      </div>
                    </td>
                    <td>
                      {position.isAutomated ? (
                        <Badge variant="outline" className="bg-secondary/30">
                          <Server className="h-3 w-3 mr-1" /> Auto
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isClosing[position.id]}
                        onClick={() => handleClosePosition(position.id)}
                      >
                        {isClosing[position.id] ? "Fechando..." : "Fechar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma posição aberta no momento.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
