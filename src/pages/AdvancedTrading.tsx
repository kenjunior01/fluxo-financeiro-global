
import { useState } from "react";
import { TradingTerminal } from "@/components/TradingTerminal";
import { MarketDepth } from "@/components/MarketDepth";
import { OptimizedAssetTable } from "@/components/OptimizedAssetTable";
import { AssetChart } from "@/components/AssetChart";
import { useMarket } from "@/contexts/MarketContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { Asset, AssetType } from "@/types";

const AdvancedTrading = () => {
  const { assets } = useMarket();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Use real-time data for selected symbols
  const watchedSymbols = favorites.length > 0 ? favorites : assets.slice(0, 10).map(a => a.symbol);
  const { 
    assets: realTimeAssets, 
    isLoading: isRealTimeLoading 
  } = useRealTimeData({ 
    symbols: watchedSymbols,
    updateInterval: 15000, // 15 seconds for active trading
    enabled: true
  });

  // Merge real-time data with existing assets
  const mergedAssets = assets.map(asset => {
    const realTimeAsset = realTimeAssets.find(rta => rta.symbol === asset.symbol);
    return realTimeAsset || asset;
  });

  const handleToggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Avançado</h1>
        {isRealTimeLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Atualizando dados em tempo real...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Asset Selection and Terminal */}
        <div className="xl:col-span-4 space-y-6">
          <OptimizedAssetTable
            assets={mergedAssets}
            onAssetSelect={handleAssetSelect}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
          
          <TradingTerminal />
        </div>

        {/* Center Column - Chart and Market Depth */}
        <div className="xl:col-span-8 space-y-6">
          {selectedAsset ? (
            <>
              <AssetChart asset={selectedAsset} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MarketDepth symbol={selectedAsset.symbol} />
                
                {/* Additional Analysis Panel */}
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Volume 24h</div>
                      <div className="text-xl font-bold">
                        {selectedAsset.volume.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Market Cap</div>
                      <div className="text-xl font-bold">
                        {selectedAsset.marketCap 
                          ? `$${(selectedAsset.marketCap / 1e9).toFixed(2)}B`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Price Levels */}
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Níveis de Preço</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Resistência:</span>
                        <span className="font-medium">
                          {(selectedAsset.price * 1.05).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Preço Atual:</span>
                        <span className="font-medium">
                          {selectedAsset.price.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Suporte:</span>
                        <span className="font-medium">
                          {(selectedAsset.price * 0.95).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trading Signals */}
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Sinais de Trading</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RSI (14):</span>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 text-xs rounded">
                          Neutro (52)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MACD:</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded">
                          Bullish
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MA (20):</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded">
                          Tendência Alta
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 bg-secondary/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Selecione um Ativo</div>
                <div className="text-sm text-muted-foreground">
                  Escolha um ativo da lista para visualizar gráficos e iniciar o trading
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedTrading;
