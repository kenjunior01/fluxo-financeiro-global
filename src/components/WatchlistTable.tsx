
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { Star, StarOff, Plus, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Asset } from "@/types";

export function WatchlistTable() {
  const { assets } = useMarket();
  const [watchlist, setWatchlist] = useState<Asset[]>([
    // Some initial assets in watchlist for demo purposes
    assets.find(a => a.symbol === "PETR4.SA") || assets[0],
    assets.find(a => a.symbol === "BTCUSD") || assets[1],
    assets.find(a => a.symbol === "EUR=X") || assets[2],
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAssets = searchTerm 
    ? assets.filter(asset => 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : assets;
  
  const handleToggleWatchlist = (asset: Asset) => {
    if (isInWatchlist(asset)) {
      setWatchlist(watchlist.filter(a => a.id !== asset.id));
    } else {
      setWatchlist([...watchlist, asset]);
    }
  };
  
  const isInWatchlist = (asset: Asset) => {
    return watchlist.some(a => a.id === asset.id);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>
            Acompanhe seus ativos favoritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Pesquisar ativos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Favorito</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Var. 24h</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.length > 0 ? (
                watchlist.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleWatchlist(asset)}>
                        <Star className="h-5 w-5 text-amber-500" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{asset.symbol}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{asset.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${asset.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {asset.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span>{asset.changePercent.toFixed(2)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">Negociar</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Sua watchlist está vazia
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ativos Disponíveis</CardTitle>
          <CardDescription>
            Adicione ativos à sua watchlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Favorito</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Var. 24h</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.slice(0, 5).map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleWatchlist(asset)}>
                      {isInWatchlist(asset) ? (
                        <Star className="h-5 w-5 text-amber-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{asset.symbol}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${asset.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {asset.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>{asset.changePercent.toFixed(2)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Negociar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
