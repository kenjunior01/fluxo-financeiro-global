
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchMarketNews } from "@/services/marketService";
import { MarketNewsItem } from "@/types";
import { Loader2 } from "lucide-react";

export const MarketNews = () => {
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const newsData = await fetchMarketNews();
        setNews(newsData);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar notícias");
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
    
    // Atualiza as notícias a cada 30 minutos
    const interval = setInterval(loadNews, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return 'bg-profit/10 text-profit border-profit/20';
      case 'negative': return 'bg-loss/10 text-loss border-loss/20';
      default: return 'bg-secondary border-secondary/30';
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notícias do Mercado</CardTitle>
        <CardDescription>
          Últimas notícias e atualizações do mercado financeiro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-4">
            {error}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Nenhuma notícia disponível no momento.
          </div>
        ) : (
          news.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col xs:flex-row gap-3 border-b border-secondary pb-3 last:border-0 last:pb-0"
            >
              {item.imageUrl && (
                <div className="flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-20 h-14 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium mb-1">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {item.title}
                  </a>
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatPublishedDate(item.publishedAt)}</span>
                  
                  {item.sentiment && (
                    <Badge 
                      variant="outline" 
                      className={`ml-auto ${getSentimentColor(item.sentiment)}`}
                    >
                      {item.sentiment === 'positive' ? 'Positivo' : 
                       item.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
