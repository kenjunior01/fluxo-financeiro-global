
// Vamos supor que este é o componente MarketNews já existente, mas adicionaremos suporte para modo estendido

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchMarketNews } from "@/services/marketService";
import { MarketNewsItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface MarketNewsProps {
  extended?: boolean;
}

export const MarketNews = ({ extended = false }: MarketNewsProps) => {
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await fetchMarketNews();
        setNews(newsData);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
    
    // Atualize as notícias a cada 15 minutos
    const interval = setInterval(loadNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const getSentimentIcon = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentLabel = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return "Positivo";
      case 'negative':
        return "Negativo";
      default:
        return "Neutro";
    }
  };

  const getSentimentColor = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'negative':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const displayedNews = extended ? news : news.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(extended ? 10 : 5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (extended) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNews.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col h-full">
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              )}
              <CardContent className={`p-4 ${!item.imageUrl ? 'h-full' : ''} flex flex-col`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.source}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
                <div className="mt-auto flex items-center justify-between pt-2">
                  {item.sentiment && (
                    <Badge className={`${getSentimentColor(item.sentiment)} flex items-center gap-1`}>
                      {getSentimentIcon(item.sentiment)}
                      <span>{getSentimentLabel(item.sentiment)}</span>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" asChild className="ml-auto">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <span>Ler mais</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Compact version for sidebar
  return (
    <div className="space-y-4">
      {displayedNews.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs">
                {item.source}
              </Badge>
              {item.sentiment && getSentimentIcon(item.sentiment)}
            </div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
            </a>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="ghost" size="sm" className="w-full" asChild>
        <a href="/market" className="flex items-center justify-center">
          <span>Ver todas as notícias</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </Button>
    </div>
  );
};
