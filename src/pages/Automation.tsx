
import { AutomationCard } from "@/components/AutomationCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Automation = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Automação</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutomationCard />
        
        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>
              Configure integrações com outros sistemas e plataformas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="https://placehold.co/32x32"
                    alt="n8n"
                    className="w-8 h-8 mr-3 rounded"
                  />
                  <div>
                    <div className="font-medium">n8n</div>
                    <div className="text-sm text-muted-foreground">
                      Automação de fluxos de trabalho
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  Conectado
                </span>
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="https://placehold.co/32x32"
                    alt="TradingView"
                    className="w-8 h-8 mr-3 rounded"
                  />
                  <div>
                    <div className="font-medium">TradingView</div>
                    <div className="text-sm text-muted-foreground">
                      Sinais e alertas de trading
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                  Desconectado
                </span>
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="https://placehold.co/32x32"
                    alt="MetaTrader"
                    className="w-8 h-8 mr-3 rounded"
                  />
                  <div>
                    <div className="font-medium">MetaTrader</div>
                    <div className="text-sm text-muted-foreground">
                      Sincronização com conta MT4/MT5
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                  Desconectado
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estratégias Automatizadas</CardTitle>
            <CardDescription>
              Crie e configure estratégias de trading automatizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Conecte-se ao n8n para criar estratégias automatizadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Automation;
