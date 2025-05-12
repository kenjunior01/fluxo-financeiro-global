
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMarket } from "@/contexts/MarketContext";
import { AlertCircle, Bell, Trash2 } from "lucide-react";
import { AlertSettings } from "@/types";

export const AlertsManager = () => {
  const { toast } = useToast();
  const { assets } = useMarket();
  const [alerts, setAlerts] = useState<AlertSettings[]>([
    { 
      symbol: "PETR4.SA", 
      priceTarget: 28.50, 
      direction: "above", 
      message: "Petrobras atingiu preço alvo", 
      active: true 
    },
    { 
      symbol: "VALE3.SA", 
      priceTarget: 68.75, 
      direction: "below", 
      message: "Vale abaixo do suporte", 
      active: true 
    }
  ]);
  const [newAlert, setNewAlert] = useState<AlertSettings>({
    symbol: "",
    priceTarget: 0,
    direction: "above",
    message: "",
    active: true
  });

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.priceTarget || !newAlert.message) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos para criar um alerta",
        variant: "destructive"
      });
      return;
    }

    setAlerts([...alerts, newAlert]);
    setNewAlert({
      symbol: "",
      priceTarget: 0,
      direction: "above",
      message: "",
      active: true
    });
    
    toast({
      title: "Alerta criado",
      description: `Alerta para ${newAlert.symbol} a ${newAlert.priceTarget} criado com sucesso`,
    });
  };

  const handleDeleteAlert = (index: number) => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
    
    toast({
      title: "Alerta removido",
      description: "O alerta foi removido com sucesso",
    });
  };

  const toggleAlertStatus = (index: number) => {
    const updatedAlerts = [...alerts];
    updatedAlerts[index].active = !updatedAlerts[index].active;
    setAlerts(updatedAlerts);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Alertas de Preço
        </CardTitle>
        <CardDescription>Configure alertas para oportunidades de mercado</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="mb-2 font-medium">Novo Alerta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select 
                  onValueChange={(value) => setNewAlert({...newAlert, symbol: value})}
                  value={newAlert.symbol}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Preço alvo" 
                    value={newAlert.priceTarget || ""} 
                    onChange={(e) => setNewAlert({...newAlert, priceTarget: parseFloat(e.target.value)})}
                  />
                </div>
                
                <Select 
                  value={newAlert.direction}
                  onValueChange={(value) => setNewAlert({...newAlert, direction: value as "above" | "below"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Direção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Acima</SelectItem>
                    <SelectItem value="below">Abaixo</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input 
                  placeholder="Mensagem" 
                  value={newAlert.message} 
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                />
                
                <div className="md:col-span-2">
                  <Button onClick={handleAddAlert} className="w-full">
                    Adicionar Alerta
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 font-medium">Alertas Ativos</h3>
              <div className="space-y-2">
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum alerta configurado
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium">{alert.symbol}</span>
                          <Badge variant={alert.active ? "default" : "outline"} className="ml-2">
                            {alert.direction === "above" ? "Acima" : "Abaixo"} {alert.priceTarget}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={alert.active} 
                          onCheckedChange={() => toggleAlertStatus(index)}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteAlert(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
