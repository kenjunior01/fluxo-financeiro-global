
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingStrategies } from "@/components/TradingStrategies";
import { BacktestingTool } from "@/components/BacktestingTool";
import { AlertsManager } from "@/components/AlertsManager";
import { Brain, History, BellRing } from "lucide-react";

const Automation = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Automação</h1>
      <p className="text-muted-foreground mb-6">
        Configure estratégias automatizadas, alertas e realize backtests
      </p>
      
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="strategies" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span className="hidden xs:inline">Estratégias</span>
          </TabsTrigger>
          <TabsTrigger value="backtest" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden xs:inline">Backtest</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            <span className="hidden xs:inline">Alertas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="strategies">
          <div className="space-y-6">
            <TradingStrategies />
          </div>
        </TabsContent>
        
        <TabsContent value="backtest">
          <div className="space-y-6">
            <BacktestingTool />
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <div className="space-y-6">
            <AlertsManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
