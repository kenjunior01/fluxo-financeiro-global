
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LineChart, BarChart3, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useMarket } from "@/contexts/MarketContext";
import { Asset } from "@/types";

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
    <div className="flex flex-col gap-10 py-8 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 py-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fluxo Financeiro Global
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Plataforma completa de trading para diversos instrumentos financeiros 
            com análises em tempo real e gestão profissional de ativos.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Começar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/market">Explorar mercados</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {featuredAssets.map(asset => (
            <Card key={asset.id} className="overflow-hidden">
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
      </section>

      {/* Live Ticker */}
      <section className="relative overflow-hidden border rounded-lg bg-secondary/20 py-4">
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

      {/* Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Recursos da Plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                <LineChart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Diversos Instrumentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Acesso a uma ampla gama de ativos financeiros incluindo Forex, Criptomoedas, 
              CFDs, Commodities, Índices e mais, tudo em uma única plataforma.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <Card className="bg-primary/5">
          <CardContent className="py-12 px-6">
            <h2 className="text-3xl font-bold mb-4">Comece a negociar agora</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de traders que já estão utilizando nossa plataforma para 
              acessar mercados globais e maximizar seus investimentos.
            </p>
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Entrar na plataforma <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
