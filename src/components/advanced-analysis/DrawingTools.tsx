
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, 
  TrendingUp, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Save, 
  Trash2,
  Undo,
  Redo
} from "lucide-react";

interface DrawingTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DrawingObject {
  id: string;
  type: string;
  points: { x: number; y: number }[];
  color: string;
  text?: string;
}

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
}

const drawingTools: DrawingTool[] = [
  {
    id: 'line',
    name: 'Linha',
    icon: <Minus className="h-4 w-4" />,
    description: 'Desenhar linha de tendência'
  },
  {
    id: 'trendline',
    name: 'Tendência',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Linha de tendência automática'
  },
  {
    id: 'rectangle',
    name: 'Retângulo',
    icon: <Square className="h-4 w-4" />,
    description: 'Desenhar retângulo de suporte/resistência'
  },
  {
    id: 'circle',
    name: 'Círculo',
    icon: <Circle className="h-4 w-4" />,
    description: 'Desenhar círculo para destacar áreas'
  },
  {
    id: 'text',
    name: 'Texto',
    icon: <Type className="h-4 w-4" />,
    description: 'Adicionar anotação de texto'
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    icon: <div className="text-xs font-mono">φ</div>,
    description: 'Retração de Fibonacci'
  }
];

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  onToolSelect,
  selectedTool
}) => {
  const [drawings, setDrawings] = useState<DrawingObject[]>([]);
  const [history, setHistory] = useState<DrawingObject[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#f97316', // orange
    '#64748b'  // gray
  ];

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...drawings]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDrawings([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDrawings([...history[historyIndex + 1]]);
    }
  };

  const clearAll = () => {
    setDrawings([]);
    saveToHistory();
  };

  const removeSelected = () => {
    // Em uma implementação real, removeria apenas os objetos selecionados
    setDrawings([]);
    saveToHistory();
  };

  const saveDrawings = () => {
    // Em uma implementação real, salvaria os desenhos no storage local ou servidor
    localStorage.setItem('chart-drawings', JSON.stringify(drawings));
    console.log('Desenhos salvos:', drawings);
  };

  useEffect(() => {
    // Carregar desenhos salvos
    const saved = localStorage.getItem('chart-drawings');
    if (saved) {
      try {
        const parsedDrawings = JSON.parse(saved);
        setDrawings(parsedDrawings);
      } catch (error) {
        console.error('Erro ao carregar desenhos:', error);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas de Desenho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ferramentas de Desenho */}
        <div className="grid grid-cols-2 gap-2">
          {drawingTools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className="flex items-center space-x-2 p-3 h-auto"
              title={tool.description}
            >
              {tool.icon}
              <span className="text-xs">{tool.name}</span>
            </Button>
          ))}
        </div>

        <Separator />

        {/* Paleta de Cores */}
        <div>
          <h4 className="text-sm font-medium mb-2">Cores</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Controles de Ação */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                title="Desfazer"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                title="Refazer"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={removeSelected}
                title="Apagar selecionado"
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                title="Limpar tudo"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={saveDrawings}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Desenhos
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          <Badge variant="outline">
            {drawings.length} objeto(s) desenhado(s)
          </Badge>
        </div>

        {/* Instruções */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Linha:</strong> Clique e arraste para desenhar</p>
          <p><strong>Fibonacci:</strong> Clique em dois pontos para retração</p>
          <p><strong>Texto:</strong> Clique para adicionar anotação</p>
        </div>
      </CardContent>
    </Card>
  );
};
