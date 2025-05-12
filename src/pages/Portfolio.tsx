
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PortfolioAssetCard, PortfolioAssetDisplay } from "@/components/PortfolioAssetCard";
import { ImportTradesForm } from "@/components/ImportTradesForm";
import { 
  PieChart, BarChart, LineChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, Bar, Pie, Line 
} from "recharts";
import { BarChart3, FileUp, PieChart as PieChartIcon, Activity, Globe } from "lucide-react";

// Mock data for portfolio allocation
const allocationData = [
  { name: 'Ações', value: 45 },
  { name: 'Renda Fixa', value: 25 },
  { name: 'Criptomoedas', value: 15 },
  { name: 'FIIs', value: 10 },
  { name: 'Outros', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data for sector distribution
const sectorData = [
  { name: 'Tecnologia', value: 28 },
  { name: 'Financeiro', value: 22 },
  { name: 'Consumo', value: 18 },
  { name: 'Energia', value: 12 },
  { name: 'Saúde', value: 10 },
  { name: 'Materiais', value: 6 },
  { name: 'Telecomunicações', value: 4 },
];

// Mock data for performance over time
const performanceData = Array(12).fill(0).map((_, index) => {
  const month = new Date();
  month.setMonth(month.getMonth() - (11 - index));
  
  return {
    name: month.toLocaleString('pt-BR', { month: 'short' }),
    portfolio: 100 * (1 + 0.003 * (index + Math.random() * 5 - 2)),
    ibovespa: 100 * (1 + 0.002 * (index + Math.random() * 4 - 2)),
  };
});

// Define the PortfolioAssetCardProps interface to match the component's props
interface PortfolioAssetCardProps {
  symbol: string;
  name: string;
  type: string;
  currentPrice: number;
  averagePrice: number;
  quantity: number;
  profit: number;
  profitPercentage: number;
}

const Portfolio = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Portfólio</h1>
      <p className="text-muted-foreground mb-6">
        Analise seu portfólio e acompanhe o desempenho dos seus investimentos
      </p>
      
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Valor Total</h3>
              <p className="text-4xl font-bold">R$ 156.789,42</p>
              <div className="flex items-center mt-1 space-x-1">
                <span className="text-sm bg-primary-foreground/20 px-2 py-0.5 rounded-full">+4.2%</span>
                <span className="text-xs opacity-80">este mês</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Lucro Total</h3>
              <p className="text-4xl font-bold">R$ 23.456,18</p>
              <div className="flex items-center mt-1 space-x-1">
                <span className="text-sm bg-primary-foreground/20 px-2 py-0.5 rounded-full">+17.6%</span>
                <span className="text-xs opacity-80">desde o início</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Dividendos</h3>
              <p className="text-4xl font-bold">R$ 3.942,75</p>
              <div className="flex items-center mt-1 space-x-1">
                <span className="text-sm bg-primary-foreground/20 px-2 py-0.5 rounded-full">R$ 428,50</span>
                <span className="text-xs opacity-80">último mês</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Ativos</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Desempenho</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-1">
            <FileUp className="h-4 w-4" />
            <span>Importar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Desempenho do Portfólio
                </CardTitle>
                <CardDescription>
                  Acompanhe o desempenho do seu portfólio ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="portfolio" name="Seu Portfólio" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="ibovespa" name="Ibovespa" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Alocação da Carteira
                </CardTitle>
                <CardDescription>
                  Distribuição dos seus investimentos por classe de ativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Distribuição por Setor
                </CardTitle>
                <CardDescription>
                  Exposição do seu portfólio por setor econômico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sectorData}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 'dataMax + 5']} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Bar dataKey="value" fill="#8884d8">
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumo do Portfólio</CardTitle>
                <CardDescription>
                  Visão consolidada dos principais indicadores do seu portfólio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioSummary />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assets">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PortfolioAssetDisplay 
                symbol="PETR4"
                name="Petrobras"
                type="stock"
                currentPrice={34.28}
                averagePrice={29.15}
                quantity={150}
                profit={770}
                profitPercentage={17.63}
              />
              <PortfolioAssetDisplay 
                symbol="VALE3"
                name="Vale"
                type="stock"
                currentPrice={68.45}
                averagePrice={72.30}
                quantity={100}
                profit={-385}
                profitPercentage={-5.33}
              />
              <PortfolioAssetDisplay 
                symbol="ITUB4"
                name="Itaú Unibanco"
                type="stock"
                currentPrice={30.12}
                averagePrice={27.80}
                quantity={200}
                profit={464}
                profitPercentage={8.35}
              />
              <PortfolioAssetDisplay 
                symbol="BTCUSD"
                name="Bitcoin"
                type="crypto"
                currentPrice={63578.45}
                averagePrice={42500.00}
                quantity={0.15}
                profit={3161.77}
                profitPercentage={49.60}
              />
              <PortfolioAssetDisplay 
                symbol="XPLG11"
                name="XP Log FII"
                type="fund"
                currentPrice={98.75}
                averagePrice={103.20}
                quantity={120}
                profit={-534}
                profitPercentage={-4.31}
              />
              <PortfolioAssetDisplay 
                symbol="AAPL"
                name="Apple Inc."
                type="stock"
                currentPrice={185.92}
                averagePrice={162.45}
                quantity={25}
                profit={586.75}
                profitPercentage={14.45}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Mensal</CardTitle>
                <CardDescription>
                  Retornos mensais do seu portfólio comparados ao benchmark
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        typeof value === 'number' ? `${(value - 100).toFixed(2)}%` : value, 
                        name === 'portfolio' ? 'Seu Portfólio' : 'Ibovespa'
                      ]} />
                      <Legend />
                      <Bar dataKey="portfolio" name="Seu Portfólio" fill="#8884d8" />
                      <Bar dataKey="ibovespa" name="Ibovespa" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Portfólio</CardTitle>
                <CardDescription>
                  Medidas de desempenho e risco do seu portfólio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Retorno Anual</p>
                      <p className="text-2xl font-bold text-green-600">+18.4%</p>
                      <p className="text-xs text-muted-foreground">vs. Benchmark +12.8%</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Volatilidade</p>
                      <p className="text-2xl font-bold">16.7%</p>
                      <p className="text-xs text-muted-foreground">Desvio padrão anualizado</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-2xl font-bold">1.28</p>
                      <p className="text-xs text-muted-foreground">Risco ajustado ao retorno</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Beta</p>
                      <p className="text-2xl font-bold">0.92</p>
                      <p className="text-xs text-muted-foreground">Correlação com o mercado</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Retorno Acumulado</p>
                      <p className="text-2xl font-bold text-green-600">+47.2%</p>
                      <p className="text-xs text-muted-foreground">Desde o início</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Drawdown Máximo</p>
                      <p className="text-2xl font-bold text-red-600">-12.6%</p>
                      <p className="text-xs text-muted-foreground">Maior queda do período</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Análise de Desempenho</h4>
                    <p className="text-sm text-muted-foreground">
                      Seu portfólio superou o benchmark em 5.6% no último ano, com uma volatilidade abaixo da média do mercado.
                      A diversificação entre diferentes classes de ativos contribuiu para o melhor desempenho ajustado ao risco.
                      Recomendamos aumentar a exposição em setores defensivos para reduzir a correlação com o mercado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="import">
          <div className="space-y-6">
            <ImportTradesForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolio;
