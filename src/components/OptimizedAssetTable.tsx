
import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset, AssetType } from "@/types";
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react";

interface OptimizedAssetTableProps {
  assets: Asset[];
  onAssetSelect?: (asset: Asset) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  selectedType?: AssetType | "all";
  onTypeChange?: (type: AssetType | "all") => void;
  favorites?: string[];
  onToggleFavorite?: (symbol: string) => void;
}

const AssetRow = memo(({ 
  asset, 
  onSelect, 
  isFavorite, 
  onToggleFavorite 
}: { 
  asset: Asset;
  onSelect?: (asset: Asset) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (symbol: string) => void;
}) => {
  const handleRowClick = useCallback(() => {
    onSelect?.(asset);
  }, [asset, onSelect]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(asset.symbol);
  }, [asset.symbol, onToggleFavorite]);

  return (
    <tr 
      className="hover:bg-secondary/50 cursor-pointer transition-colors"
      onClick={handleRowClick}
    >
      <td className="p-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <Star 
              className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
            />
          </Button>
          <div>
            <div className="font-medium">{asset.symbol}</div>
            <div className="text-sm text-muted-foreground truncate max-w-32">
              {asset.name}
            </div>
          </div>
        </div>
      </td>
      
      <td className="p-3 text-center">
        <Badge variant="outline" className="text-xs">
          {asset.type.toUpperCase()}
        </Badge>
      </td>
      
      <td className="p-3 text-right font-medium">
        {asset.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: asset.price < 1 ? 6 : 2
        })}
      </td>
      
      <td className="p-3 text-right">
        <div className={`flex items-center justify-end ${
          asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {asset.changePercent >= 0 ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          <span className="font-medium">
            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}
        </div>
      </td>
      
      <td className="p-3 text-right">
        <div className="text-sm">
          {asset.volume.toLocaleString()}
        </div>
      </td>
      
      <td className="p-3 text-right">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-green-600">H: {asset.high.toFixed(2)}</div>
          <div className="text-red-600">L: {asset.low.toFixed(2)}</div>
        </div>
      </td>
    </tr>
  );
});

AssetRow.displayName = 'AssetRow';

export const OptimizedAssetTable = memo(({
  assets,
  onAssetSelect,
  searchTerm = '',
  onSearchChange,
  selectedType = 'all',
  onTypeChange,
  favorites = [],
  onToggleFavorite
}: OptimizedAssetTableProps) => {
  const assetTypes: { value: AssetType | "all"; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "forex", label: "Forex" },
    { value: "crypto", label: "Criptomoedas" },
    { value: "stock", label: "Ações" },
    { value: "commodity", label: "Commodities" },
    { value: "index", label: "Índices" },
  ];

  // Memoized filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = searchTerm === '' || 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [assets, searchTerm, selectedType]);

  // Sort assets: favorites first, then by volume
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.symbol);
      const bIsFavorite = favorites.includes(b.symbol);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      return b.volume - a.volume;
    });
  }, [filteredAssets, favorites]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div>
            <CardTitle>Ativos do Mercado</CardTitle>
            <CardDescription>
              Lista otimizada de ativos com dados em tempo real
            </CardDescription>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por símbolo ou nome..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {assetTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTypeChange?.(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30">
              <tr className="text-left">
                <th className="p-3 font-medium">Ativo</th>
                <th className="p-3 font-medium text-center">Tipo</th>
                <th className="p-3 font-medium text-right">Preço</th>
                <th className="p-3 font-medium text-right">Variação</th>
                <th className="p-3 font-medium text-right">Volume</th>
                <th className="p-3 font-medium text-right">Max/Min</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {sortedAssets.length > 0 ? (
                sortedAssets.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onSelect={onAssetSelect}
                    isFavorite={favorites.includes(asset.symbol)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhum ativo encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {sortedAssets.length > 0 && (
          <div className="p-4 border-t bg-secondary/10">
            <div className="text-sm text-muted-foreground text-center">
              Mostrando {sortedAssets.length} de {assets.length} ativos
              {favorites.length > 0 && ` • ${favorites.length} favoritos`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedAssetTable.displayName = 'OptimizedAssetTable';
