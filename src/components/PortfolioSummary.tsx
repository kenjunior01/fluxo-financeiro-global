
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMarket } from "@/contexts/MarketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function PortfolioSummary() {
  const { positions } = useMarket();
  const { currentUser } = useAuth();
  
  const userPositions = positions.filter(p => p.userId === currentUser?.id);
  const openPositions = userPositions.filter(p => p.status === "open");
  
  // Calculate summary metrics
  const totalInvested = openPositions.reduce((total, p) => total + p.amount, 0);
  const totalWithLeverage = openPositions.reduce((total, p) => total + (p.amount * p.leverage), 0);
  const totalProfit = openPositions.reduce((total, p) => total + p.profit, 0);
  
  const bestPerformer = openPositions.length > 0 
    ? openPositions.reduce((best, current) => 
        current.profitPercent > best.profitPercent ? current : best
      ) 
    : null;
    
  const worstPerformer = openPositions.length > 0 
    ? openPositions.reduce((worst, current) => 
        current.profitPercent < worst.profitPercent ? current : worst
      ) 
    : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Portfólio</CardTitle>
        <CardDescription>
          Visão geral das suas posições atuais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Capital Investido</p>
            <p className="text-xl font-bold mt-1">
              R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Valor com Alavancagem</p>
            <p className="text-xl font-bold mt-1">
              R$ {totalWithLeverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Lucro/Prejuízo Total</p>
            <p className={`text-xl font-bold mt-1 ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Posições Abertas</p>
            <p className="text-xl font-bold mt-1">
              {openPositions.length}
            </p>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Alavancagem</TableHead>
              <TableHead>Preço Atual</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.asset.symbol}</TableCell>
                <TableCell>
                  <Badge variant={position.type === 'buy' ? 'default' : 'destructive'}>
                    {position.type === 'buy' ? 'Compra' : 'Venda'}
                  </Badge>
                </TableCell>
                <TableCell>R$ {position.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{position.leverage}x</TableCell>
                <TableCell>{position.currentPrice.toFixed(4)}</TableCell>
                <TableCell className={position.profit >= 0 ? 'text-profit' : 'text-loss'}>
                  {position.profit.toFixed(2)} ({position.profitPercent.toFixed(2)}%)
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Aberta</Badge>
                </TableCell>
              </TableRow>
            ))}
            {openPositions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhuma posição aberta no momento
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {openPositions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestPerformer && (
              <div className="p-4 bg-profit/10 rounded-lg">
                <p className="text-sm font-medium">Melhor Desempenho</p>
                <p className="text-lg font-bold mt-1">{bestPerformer.asset.symbol}</p>
                <p className="text-sm text-profit mt-1">
                  +{bestPerformer.profitPercent.toFixed(2)}% (R$ {bestPerformer.profit.toFixed(2)})
                </p>
              </div>
            )}
            
            {worstPerformer && (
              <div className="p-4 bg-loss/10 rounded-lg">
                <p className="text-sm font-medium">Pior Desempenho</p>
                <p className="text-lg font-bold mt-1">{worstPerformer.asset.symbol}</p>
                <p className="text-sm text-loss mt-1">
                  {worstPerformer.profitPercent.toFixed(2)}% (R$ {worstPerformer.profit.toFixed(2)})
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
