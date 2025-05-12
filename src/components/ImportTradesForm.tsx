
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, CheckCircle, XCircle } from "lucide-react";

const supportedBrokers = [
  { id: "clear", name: "Clear" },
  { id: "xp", name: "XP Investimentos" },
  { id: "rico", name: "Rico" },
  { id: "binance", name: "Binance" },
  { id: "mt5", name: "MetaTrader 5" },
];

const supportedFileTypes = [
  { id: "csv", name: "CSV", mimeType: "text/csv" },
  { id: "xlsx", name: "Excel (XLSX)", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { id: "json", name: "JSON", mimeType: "application/json" },
];

export const ImportTradesForm = () => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    errors: string[];
    trades: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setValidationResults(null);
    }
  };

  const validateFile = () => {
    if (!file || !selectedBroker || !selectedFileType) {
      toast({
        title: "Dados incompletos",
        description: "Selecione a corretora, o tipo de arquivo e faça o upload do arquivo.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 150);

    // Simulate validation delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock validation result - in a real app, this would come from API
      const mockResult = {
        valid: Math.random() > 0.3, // 70% chance of success for demo
        errors: [] as string[],
        trades: Math.floor(Math.random() * 50) + 10,
      };
      
      if (!mockResult.valid) {
        // Add some mock errors
        const possibleErrors = [
          "Formato de data inválido na linha 12",
          "Valor de preço negativo na linha 18",
          "Símbolo de ativo não reconhecido na linha 24",
          "Tipo de ordem inválido na linha 7",
        ];
        
        const numErrors = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numErrors; i++) {
          mockResult.errors.push(possibleErrors[Math.floor(Math.random() * possibleErrors.length)]);
        }
      }
      
      setValidationResults(mockResult);
      setIsUploading(false);
      
      if (mockResult.valid) {
        toast({
          title: "Validação concluída",
          description: `${mockResult.trades} operações foram validadas e estão prontas para importação.`,
        });
      } else {
        toast({
          title: "Erros de validação",
          description: `Foram encontrados ${mockResult.errors.length} erros no arquivo.`,
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const importTrades = () => {
    if (!validationResults || !validationResults.valid) return;
    
    toast({
      title: "Importação concluída",
      description: `${validationResults.trades} operações foram importadas com sucesso.`,
    });
    
    // Reset the form
    setFile(null);
    setSelectedBroker("");
    setSelectedFileType("");
    setValidationResults(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Importar Operações
        </CardTitle>
        <CardDescription>
          Importe operações de sua corretora para análise e acompanhamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="broker">Corretora</Label>
              <Select
                value={selectedBroker}
                onValueChange={setSelectedBroker}
              >
                <SelectTrigger id="broker" className="mt-1">
                  <SelectValue placeholder="Selecione a corretora" />
                </SelectTrigger>
                <SelectContent>
                  {supportedBrokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.id}>
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fileType">Tipo de Arquivo</Label>
              <Select
                value={selectedFileType}
                onValueChange={setSelectedFileType}
              >
                <SelectTrigger id="fileType" className="mt-1">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  {supportedFileTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
            <div className="mb-4">
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
              <p className="text-sm text-muted-foreground text-center">
                Arraste e solte o arquivo aqui, ou clique para selecionar
              </p>
            </div>
            
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Selecionar Arquivo
            </Button>
            
            {file && (
              <div className="mt-4 text-sm">
                <p className="font-medium">Arquivo selecionado:</p>
                <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
              </div>
            )}
          </div>
          
          {file && (
            <div className="space-y-4">
              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Validando arquivo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button onClick={validateFile} disabled={!file || !selectedBroker || !selectedFileType}>
                  Validar Arquivo
                </Button>
              )}
            </div>
          )}
          
          {validationResults && (
            <div className={`p-4 rounded-md ${validationResults.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {validationResults.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${validationResults.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {validationResults.valid ? 'Validação bem-sucedida' : 'Erros de validação'}
                  </h3>
                  {validationResults.valid ? (
                    <div className="mt-2 text-sm text-green-700">
                      <p>O arquivo contém {validationResults.trades} operações válidas prontas para importação.</p>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {validationResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationResults.valid && (
                    <div className="mt-4">
                      <Button onClick={importTrades} className="bg-green-600 hover:bg-green-700">
                        Importar {validationResults.trades} Operações
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
