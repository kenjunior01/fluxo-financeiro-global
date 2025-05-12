
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LineChart, BarChart3, Users, Shield, Zap, PieChart, Globe, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import { useMarket } from "@/contexts/MarketContext";
import { Asset } from "@/types";
import { MainNavigation } from "@/components/MainNavigation";

const Home = () => {
  const { tickers } = useMarket();
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([]);
  const { assets } = useMarket();
  
  useEffect(() => {
    // Select a diverse set of featured assets (one from each category if possible)
    const assetTypes = ["forex", "crypto", "stock", "commodity", "index"];
    const featured = assetTypes.map(type => {
      return assets.find(asset => asset.type === type) || null;
    }).filter(Boolean) as Asset[];
    
    // If we don't have one of each type, just take the first few assets
    if (featured.length < 3) {
      setFeaturedAssets(assets.slice(0, 4));
    } else {
      setFeaturedAssets(featured.slice(0, 4));
    }
  }, [assets]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Navigation */}
      <div className="bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto">
          <MainNavigation />
          
          <div className="flex flex-col md:flex-row items-center gap-8 py-16 px-6">
            <div className="flex-1">
              <Badge className="mb-4" variant="outline">Plataforma Completa</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Fluxo Financeiro Global
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-lg">
                Plataforma completa de trading para diversos instrumentos financeiros 
                com análises em tempo real e gestão profissional de ativos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/dashboard">
                    Começar agora <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/market">Explorar mercados</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {featuredAssets.map(asset => (
                <Card key={asset.id} className="overflow-hidden backdrop-blur-sm bg-card/80 border-secondary/50">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                      <Badge variant={asset.changePercent >= 0 ? "outline" : "destructive"} className={asset.changePercent >= 0 ? "text-profit" : "text-loss"}>
                        {asset.changePercent >= 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <CardDescription>{asset.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-lg font-bold">
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <section className="relative overflow-hidden border-y border-secondary bg-secondary/10 py-4">
        <div className="animate-slide whitespace-nowrap flex">
          {[...tickers, ...tickers].map((ticker, index) => (
            <div 
              key={`${ticker.symbol}-${index}`}
              className="inline-block px-6"
            >
              <span className="font-medium">{ticker.symbol}</span>
              <span className="mx-2">
                {ticker.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </span>
              <span 
                className={ticker.change >= 0 ? "text-profit" : "text-loss"}
              >
                {ticker.change >= 0 ? "+" : ""}{ticker.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Market Types */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2">Mercados</Badge>
            <h2 className="text-3xl font-bold mb-4">Diversos Instrumentos Financeiros</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acesse uma ampla gama de ativos financeiros em uma única plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MarketTypeCard
              title="Forex"
              description="Negocie pares de moedas como EUR/USD, GBP/JPY e muito mais"
              icon={Globe}
              bgClass="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
            />
            <MarketTypeCard
              title="Criptomoedas"
              description="Bitcoin, Ethereum e outras criptomoedas populares"
              icon={PieChart}
              bgClass="bg-gradient-to-br from-purple-500/10 to-purple-600/5"
            />
            <MarketTypeCard
              title="Ações"
              description="Ações de empresas nacionais e internacionais"
              icon={BriefcaseBusiness}
              bgClass="bg-gradient-to-br from-green-500/10 to-green-600/5"
            />
            <MarketTypeCard
              title="Commodities"
              description="Ouro, petróleo, prata e outras commodities"
              icon={LineChart}
              bgClass="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"
            />
            <MarketTypeCard
              title="Índices"
              description="Principais índices como S&P 500, NASDAQ, IBOVESPA"
              icon={BarChart3}
              bgClass="bg-gradient-to-br from-red-500/10 to-red-600/5"
            />
            <MarketTypeCard
              title="ETFs"
              description="Fundos de índice negociados em bolsa"
              icon={LineChart}
              bgClass="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2">Recursos</Badge>
            <h2 className="text-3xl font-bold mb-4">Recursos da Plataforma</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para maximizar seus resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Análises em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Dados e gráficos atualizados em tempo real para todos os ativos, com 
                indicadores técnicos avançados e ferramentas de análise profissional.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Gestão de Contas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conta com gestores profissionais que podem ajudar a gerenciar seus investimentos, 
                abrindo posições manualmente ou através de automação inteligente.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Trading Automatizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Integração com n8n para automação de estratégias de trading, permitindo negociações 
                programadas baseadas em condições de mercado e análises técnicas.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Níveis de Permissão</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Estrutura hierárquica de permissões com Super Administradores, Administradores, 
                Gestores de Contas e Traders, garantindo controle e segurança.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Notícias do Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Acompanhe as últimas notícias e eventos que influenciam o mercado, com análise 
                de sentimento e impacto potencial sobre diferentes ativos.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Dashboard Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configure seu painel de controle com os widgets e informações que são mais relevantes 
                para sua estratégia de trading e acompanhe seu desempenho.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2">Depoimentos</Badge>
            <h2 className="text-3xl font-bold mb-4">O que dizem nossos usuários</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experiências reais de traders que utilizam nossa plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Carlos Silva"
              role="Trader Profissional"
              testimonial="A plataforma transformou minha abordagem ao trading. As análises em tempo real e as ferramentas de automação são excepcionais."
            />
            <TestimonialCard 
              name="Ana Rodrigues"
              role="Investidora Independente"
              testimonial="Comecei a investir há pouco tempo e esta plataforma tornou o processo muito mais acessível. Os recursos educacionais são excelentes."
            />
            <TestimonialCard 
              name="Roberto Almeida"
              role="Gestor de Fundos"
              testimonial="Como gestor, valorizo a capacidade de supervisionar múltiplas contas e implementar estratégias automatizadas. Economiza muito tempo."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Comece a negociar agora</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de traders que já estão utilizando nossa plataforma para 
            acessar mercados globais e maximizar seus investimentos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/dashboard">
                Entrar na plataforma <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/market">Explorar mercados</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

interface MarketTypeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
}

const MarketTypeCard = ({ title, description, icon: Icon, bgClass }: MarketTypeCardProps) => (
  <Card className={`border border-secondary/50 overflow-hidden ${bgClass}`}>
    <CardHeader>
      <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
}

const TestimonialCard = ({ name, role, testimonial }: TestimonialCardProps) => (
  <Card className="border border-secondary/50">
    <CardContent className="pt-6">
      <div className="flex items-center mb-2">
        <div className="flex text-primary">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>
      <p className="mb-6 italic">"{testimonial}"</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
);

export default Home;
