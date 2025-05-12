
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Newspaper, TrendingUp, TrendingDown, Filter, ExternalLink } from "lucide-react";
import { fetchMarketNews } from "@/services/marketService";
import { MarketNewsItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface NewsCategory {
  id: string;
  name: string;
  symbol: string;
}

export const FinancialNews = () => {
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories] = useState<NewsCategory[]>([
    { id: "all", name: "Todos", symbol: "" },
    { id: "stocks", name: "Ações", symbol: "IBOV,PETR4.SA,VALE3.SA,ITUB4.SA" },
    { id: "crypto", name: "Criptomoedas", symbol: "BTC,ETH,BNB" },
    { id: "forex", name: "Forex", symbol: "USD,EUR,BRL" },
  ]);
  
  useEffect(() => {
    loadNews();
    
    // Atualiza as notícias a cada 15 minutos
    const interval = setInterval(loadNews, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedCategory]);
  
  const loadNews = async () => {
    setLoading(true);
    try {
      const category = categories.find(c => c.id === selectedCategory);
      const symbols = category?.symbol || "";
      
      const newsData = await fetchMarketNews(symbols);
      setNews(newsData);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar notícias");
      console.error("Failed to fetch news:", err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar notícias",
        description: "Não foi possível obter as últimas notícias financeiras. Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'negative': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-secondary border-secondary/30';
    }
  };
  
  const getSentimentIcon = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-3 w-3" />;
      case 'negative': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };
  
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getSourceInitials = (source: string): string => {
    if (!source) return "FF";
    
    const words = source.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    return source.substring(0, 2).toUpperCase();
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <CardTitle>Notícias Financeiras</CardTitle>
          </div>
          <Button size="sm" variant="ghost" onClick={loadNews} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar"}
          </Button>
        </div>
        <CardDescription>
          Últimas notícias e análises do mercado financeiro
        </CardDescription>
        
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mt-2">
          <TabsList className="grid grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadNews}>
              Tentar novamente
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-2">Nenhuma notícia disponível no momento.</p>
            <Button variant="outline" size="sm" onClick={loadNews}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          news.map((item, index) => (
            <div key={item.id || `news-${index}`}>
              {index > 0 && <Separator className="my-4" />}
              
              <div className="flex gap-4">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-24 h-16 object-cover rounded-md hidden xs:block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-16 bg-secondary/50 rounded-md flex items-center justify-center hidden xs:flex">
                    <Newspaper className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-2">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-primary"
                      >
                        {item.title}
                      </a>
                    </h3>
                    
                    {item.sentiment && (
                      <Badge 
                        variant="outline" 
                        className={`${getSentimentColor(item.sentiment)} ml-2 flex items-center gap-1 whitespace-nowrap`}
                      >
                        {getSentimentIcon(item.sentiment)}
                        {item.sentiment === 'positive' ? 'Positivo' : 
                        item.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-secondary">
                        {getSourceInitials(item.source)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <span>{formatPublishedDate(item.publishedAt)}</span>
                    
                    <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">Abrir notícia</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
