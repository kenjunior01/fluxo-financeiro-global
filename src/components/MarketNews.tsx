
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockNews } from "@/services/mockData";

export const MarketNews = () => {  
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return 'bg-profit/10 text-profit border-profit/20';
      case 'negative': return 'bg-loss/10 text-loss border-loss/20';
      default: return 'bg-secondary border-secondary/30';
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
        {mockNews.map((news) => (
          <div 
            key={news.id}
            className="flex flex-col xs:flex-row gap-3 border-b border-secondary pb-3 last:border-0 last:pb-0"
          >
            {news.imageUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={news.imageUrl} 
                  alt={news.title}
                  className="w-20 h-14 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-medium mb-1">
                <a href={news.url} className="hover:text-primary">
                  {news.title}
                </a>
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{news.source}</span>
                <span>•</span>
                <span>{new Date(news.publishedAt).toLocaleString()}</span>
                
                {news.sentiment && (
                  <Badge 
                    variant="outline" 
                    className={`ml-auto ${getSentimentColor(news.sentiment)}`}
                  >
                    {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
