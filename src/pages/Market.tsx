
import { useState } from "react";
import { AssetChart } from "@/components/AssetChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarket } from "@/contexts/MarketContext";
import { Asset, AssetType } from "@/types";

const Market = () => {
  const { assets } = useMarket();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(
    assets.length > 0 ? assets[0] : null
  );

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

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Mercado</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset selection and filtering */}
        <Card>
          <CardHeader>
            <CardTitle>Ativos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Buscar ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredAssets.length > 0 ? (
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

        {/* Asset Chart */}
        {selectedAsset && <AssetChart asset={selectedAsset} />}
      </div>
    </div>
  );
};

export default Market;
