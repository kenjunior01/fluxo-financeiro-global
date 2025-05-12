
import React, { useState } from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const BacktestingTool = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 365)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [strategy, setStrategy] = useState<string>('SMA');
  const [backtestResults, setBacktestResults] = useState<any[]>([]);

  const handleBacktest = async () => {
    // Mock backtesting results
    const mockResults = Array.from({ length: 100 }, (_, i) => ({
      date: new Date(startDate!.getTime() + i * (endDate!.getTime() - startDate!.getTime()) / 99).toLocaleDateString(),
      return: Math.random() * 2 - 1, // Random return between -1 and 1
    }));
    setBacktestResults(mockResults);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Backtesting</CardTitle>
          <CardDescription>Simule estratégias de negociação com dados históricos</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="symbol">Ativo</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="strategy">Estratégia</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma estratégia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMA">Média Móvel Simples (SMA)</SelectItem>
                <SelectItem value="EMA">Média Móvel Exponencial (EMA)</SelectItem>
                <SelectItem value="RSI">Índice de Força Relativa (RSI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleBacktest}>Executar Backtest</Button>
        </CardContent>
      </Card>

      {backtestResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Backtest</CardTitle>
            <CardDescription>Desempenho da estratégia simulada</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={backtestResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="return" fill="#8884d8">
                  {backtestResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.return > 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BacktestingTool;
