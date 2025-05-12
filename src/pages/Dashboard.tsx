
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketOverview } from "@/components/MarketOverview";
import { PositionsTable } from "@/components/PositionsTable";
import { MarketNews } from "@/components/MarketNews";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { AlertsManager } from "@/components/AlertsManager";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Bell, BookOpen, ChartBar, LineChart, Percent, Tv2 } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {currentUser?.name || 'Trader'}! Confira as atualizações do mercado.
          </p>
        </div>
        <Card className="min-w-[240px] bg-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Saldo Total</p>
                <p className="text-2xl font-bold">R$ 156.789,42</p>
              </div>
              <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-full px-2 py-1">
                <Percent className="h-3 w-3" />
                <span className="text-xs">+4.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <ChartBar className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Análise Técnica</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span>Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Notícias</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <MarketOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-full lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Suas Posições
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o desempenho de suas posições abertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PositionsTable />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Tv2 className="h-5 w-5 mr-2" />
                    Feed de Notícias
                  </CardTitle>
                  <CardDescription>
                    Últimas notícias do mercado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketNews />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <TechnicalAnalysis />
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6">
          <AlertsManager />
        </TabsContent>
        
        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notícias e Eventos do Mercado</CardTitle>
              <CardDescription>
                Acompanhe as últimas notícias e eventos que podem impactar o mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketNews extended />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
