
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

export function PriceAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: 'PETR4',
      targetPrice: 35.50,
      condition: 'above',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '2',
      symbol: 'VALE3',
      targetPrice: 60.00,
      condition: 'below',
      isActive: true,
      createdAt: new Date()
    }
  ]);
  
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above' as const
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      isActive: true,
      createdAt: new Date()
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ symbol: '', targetPrice: '', condition: 'above' });
    setIsDialogOpen(false);
    
    toast({
      title: "Alerta criado",
      description: `Alerta para ${alert.symbol} criado com sucesso.`,
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alerta removido",
      description: "O alerta foi removido com sucesso.",
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Alertas de Preços
            </CardTitle>
            <CardDescription>
              Configure alertas para ser notificado quando os preços atingirem seus alvos
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Alerta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Alerta de Preço</DialogTitle>
                <DialogDescription>
                  Configure um novo alerta para ser notificado quando o preço atingir o valor especificado.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Símbolo do Ativo</Label>
                  <Input
                    id="symbol"
                    placeholder="Ex: PETR4, VALE3"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetPrice">Preço Alvo (R$)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="condition">Condição</Label>
                  <Select 
                    value={newAlert.condition} 
                    onValueChange={(value) => setNewAlert({ ...newAlert, condition: value as 'above' | 'below' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Acima do preço</SelectItem>
                      <SelectItem value="below">Abaixo do preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAlert}>
                  Criar Alerta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum alerta configurado. Crie seu primeiro alerta!
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${alert.condition === 'above' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {alert.condition === 'above' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  
                  <div>
                    <div className="font-medium">{alert.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} R$ {alert.targetPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={alert.isActive ? "default" : "secondary"}>
                    {alert.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    {alert.isActive ? 'Pausar' : 'Ativar'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
