
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FinancialNews } from "@/components/FinancialNews";
import { PriceTickerBar } from "@/components/PriceTickerBar";
import { LiveChat } from "@/components/LiveChat";
import { MainNavigation } from "@/components/MainNavigation";
import { BarChart3, LineChart, TrendingUp, ShieldCheck, Users, ArrowRight, BadgeDollarSign } from "lucide-react";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar rolagem para efeitos visuais
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com navegação */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : ''}`}>
        <MainNavigation />
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0"></div>
          <div className="container px-4 py-16 md:py-24 lg:py-28 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                Conectando você ao mercado financeiro global
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Acompanhe em tempo real os movimentos do mercado, analise tendências e tome decisões informadas para seus investimentos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">
                    <TrendingUp className="h-5 w-5" />
                    Começar Agora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/market">
                    Explorar Mercados
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto mt-12 max-w-5xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-lg blur-sm"></div>
              <div className="relative bg-card rounded-lg border shadow-lg overflow-hidden">
                <PriceTickerBar />
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de Mercado */}
        <section className="bg-secondary/20 py-16">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Explore os Mercados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-3 rounded-full">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Ações & Índices</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Acompanhe as principais bolsas mundiais e ações de empresas líderes em diversos setores.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge type="stock" symbol="IBOV" name="Ibovespa" price="127.450" change="+1.2%" />
                    <Badge type="stock" symbol="PETR4" name="Petrobras" price="34.25" change="-0.5%" />
                    <Badge type="stock" symbol="VALE3" name="Vale" price="68.90" change="+2.1%" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link to="/market">
                      Ver todos os ativos <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-3 rounded-full">
                      <BadgeDollarSign className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle>Forex & Commodities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Monitore as principais moedas e commodities que impactam a economia global e seus investimentos.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge type="forex" symbol="USD/BRL" name="Dólar" price="5.104" change="-0.3%" />
                    <Badge type="forex" symbol="EUR/BRL" name="Euro" price="5.578" change="+0.2%" />
                    <Badge type="commodity" symbol="GOLD" name="Ouro" price="2.320" change="+0.6%" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link to="/market">
                      Ver todas as moedas <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-3 rounded-full">
                      <LineChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Criptomoedas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Acompanhe o desempenho das principais criptomoedas e tokens no mercado digital.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge type="crypto" symbol="BTC" name="Bitcoin" price="42.530" change="+3.2%" />
                    <Badge type="crypto" symbol="ETH" name="Ethereum" price="2.940" change="+1.8%" />
                    <Badge type="crypto" symbol="BNB" name="Binance" price="580" change="+0.9%" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link to="/market">
                      Ver todas as criptos <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Notícias e Recursos */}
        <section className="container px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Notícias e Recursos</h2>
          
          <Tabs defaultValue="news" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="news">Notícias</TabsTrigger>
              <TabsTrigger value="features">Recursos</TabsTrigger>
              <TabsTrigger value="education">Educação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="news" className="mt-6">
              <div className="h-[500px]">
                <FinancialNews />
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                  icon={<TrendingUp className="h-6 w-6 text-primary" />}
                  title="Análise em Tempo Real"
                  description="Acompanhe o mercado em tempo real com atualizações instantâneas de preços e indicadores técnicos."
                />
                <FeatureCard 
                  icon={<LineChart className="h-6 w-6 text-primary" />}
                  title="Gráficos Avançados"
                  description="Utilize gráficos interativos com diversas ferramentas de análise técnica para tomar decisões informadas."
                />
                <FeatureCard 
                  icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                  title="Automação Segura"
                  description="Configure alertas e estratégias automáticas com camadas de segurança para proteger seus investimentos."
                />
                <FeatureCard 
                  icon={<Users className="h-6 w-6 text-primary" />}
                  title="Comunidade Ativa"
                  description="Compartilhe insights e aprenda com outros investidores em nossa comunidade de trading."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Curso Básico de Mercado</CardTitle>
                    <CardDescription>Aprenda os fundamentos do mercado financeiro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Tipos de ativos e mercados</li>
                      <li>Análise fundamentalista básica</li>
                      <li>Introdução à análise técnica</li>
                      <li>Gestão de risco para iniciantes</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Em breve</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Webinários Semanais</CardTitle>
                    <CardDescription>Discussões ao vivo sobre tendências do mercado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Análise de mercado com especialistas</li>
                      <li>Discussão de oportunidades de investimento</li>
                      <li>Sessões de perguntas e respostas</li>
                      <li>Convidados especiais do setor financeiro</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Em breve</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Testimonials */}
        <section className="bg-secondary/20 py-16">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">O que dizem nossos usuários</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Junte-se a milhares de investidores que já estão usando o Fluxo Financeiro Global para tomar decisões melhores sobre seus investimentos.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/dashboard">
              Começar Gratuitamente <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="bg-secondary/30 py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-md">
                <LineChart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Fluxo Financeiro Global</span>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-4">
              <Link to="/about" className="text-muted-foreground hover:text-primary">
                Sobre Nós
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary">
                Contato
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary">
                Termos de Uso
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                Privacidade
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fluxo Financeiro Global. Todos os direitos reservados.
          </div>
        </div>
      </footer>
      
      {/* Chat ao vivo */}
      <LiveChat />
    </div>
  );
};

interface BadgeProps {
  type: 'stock' | 'forex' | 'commodity' | 'crypto';
  symbol: string;
  name: string;
  price: string;
  change: string;
}

const Badge = ({ type, symbol, name, price, change }: BadgeProps) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-card">
      <span className="font-medium text-sm">{symbol}</span>
      <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface TestimonialProps {
  name: string;
  role: string;
  testimonial: string;
  avatar?: string;
}

const TestimonialCard = ({ name, role, testimonial, avatar }: TestimonialProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 mb-4">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/10">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <p className="mb-4 text-muted-foreground italic">"{testimonial}"</p>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const testimonials: TestimonialProps[] = [
  {
    name: "Carlos Mendes",
    role: "Investidor Individual",
    testimonial: "A plataforma revolucionou a forma como acompanho o mercado. As análises em tempo real são excepcionais!"
  },
  {
    name: "Ana Luiza",
    role: "Analista de Mercado",
    testimonial: "Os recursos de automação e as ferramentas de análise técnica são precisos e fáceis de usar. Recomendo!"
  },
  {
    name: "Rodrigo Alves",
    role: "Trader Profissional",
    testimonial: "A velocidade das atualizações e a precisão dos dados são fundamentais para mim. Esta plataforma entrega isso perfeitamente."
  }
];

export default Home;
