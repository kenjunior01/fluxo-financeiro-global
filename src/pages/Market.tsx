
import { useState, useEffect } from "react";
import { AssetChart } from "@/components/AssetChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { Asset, AssetType } from "@/types";
import { Search, Loader2 } from "lucide-react";
import { MarketNews } from "@/components/MarketNews";

const Market = () => {
  const { assets, isLoading, fetchAssets } = useMarket();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const assetTypes: { value: AssetType | "all"; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "forex", label: "Forex" },
    { value: "crypto", label: "Criptomoedas" },
    { value: "stock", label: "Ações" },
    { value: "commodity", label: "Commodities" },
    { value: "index", label: "Índices" },
  ];

  const filteredAssets = assets.filter(
    (asset) =>
      (selectedType === "all" || asset.type === selectedType) &&
      (asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Set the first filtered asset as selected when assets load or filter changes
  useEffect(() => {
    if (filteredAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(filteredAssets[0]);
    } else if (filteredAssets.length > 0 && selectedAsset) {
      // Check if the selected asset is still in the filtered list
      const isStillVisible = filteredAssets.some(asset => asset.id === selectedAsset.id);
      if (!isStillVisible) {
        setSelectedAsset(filteredAssets[0]);
      }
    } else if (filteredAssets.length === 0) {
      setSelectedAsset(null);
    }
  }, [filteredAssets, selectedAsset]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssets();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mercado</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
        >
          {refreshing || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : "Atualizar Dados"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset selection and filtering */}
        <Card>
          <CardHeader>
            <CardTitle>Ativos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {assetTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            <div className="max-h-96 overflow-auto border rounded-md divide-y divide-secondary/60">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                  Carregando ativos...
                </div>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`p-3 cursor-pointer hover:bg-secondary/50 ${
                      selectedAsset?.id === asset.id ? "bg-secondary" : ""
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.name}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div>{asset.price.toFixed(2)}</div>
                        <div
                          className={
                            asset.changePercent >= 0
                              ? "text-profit text-sm"
                              : "text-loss text-sm"
                          }
                        >
                          {asset.changePercent >= 0 ? "+" : ""}
                          {asset.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum ativo encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Asset Chart and News */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Chart */}
          {selectedAsset && <AssetChart asset={selectedAsset} />}
          
          {/* Market News */}
          <MarketNews />
        </div>
      </div>
    </div>
  );
};

export default Market;
