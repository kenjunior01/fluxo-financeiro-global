
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicalIndicators } from './TechnicalIndicators';
import { DrawingTools } from './DrawingTools';
import { PatternRecognition } from './PatternRecognition';
import { ChartData } from "@/types";

interface AdvancedAnalysisPanelProps {
  data: ChartData[];
  symbol: string;
}

export const AdvancedAnalysisPanel: React.FC<AdvancedAnalysisPanelProps> = ({
  data,
  symbol
}) => {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['RSI', 'MACD']);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState('line');

  const handleToggleIndicator = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="indicators">Indicadores</TabsTrigger>
          <TabsTrigger value="drawing">Ferramentas</TabsTrigger>
          <TabsTrigger value="patterns">Padrões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="indicators" className="mt-4">
          <TechnicalIndicators
            data={data}
            selectedIndicators={selectedIndicators}
            onToggleIndicator={handleToggleIndicator}
          />
        </TabsContent>
        
        <TabsContent value="drawing" className="mt-4">
          <DrawingTools
            selectedTool={selectedDrawingTool}
            onToolSelect={setSelectedDrawingTool}
          />
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-4">
          <PatternRecognition
            data={data}
            symbol={symbol}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
