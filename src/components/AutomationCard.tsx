
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Server } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const AutomationCard = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL não informada",
        description: "Insira a URL do webhook do n8n para conectar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Conexão estabelecida",
        description: "Sua plataforma está conectada ao n8n para automação",
      });
    } catch (error) {
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar ao n8n. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerFlow = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook não configurado",
        description: "Configure a URL do webhook antes de acionar o fluxo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would make an API call to the n8n webhook
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          action: "trigger_flow",
        }),
      });

      toast({
        title: "Fluxo acionado",
        description: "O fluxo de automação foi acionado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao acionar fluxo",
        description: "Não foi possível acionar o fluxo de automação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>Automação com n8n</CardTitle>
        </div>
        <CardDescription>
          Conecte a plataforma ao n8n para automatizar operações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="webhook-url" className="text-sm font-medium">
            URL do Webhook
          </label>
          <Input
            id="webhook-url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://n8n.example.com/webhook/..."
          />
        </div>

        <div className="flex flex-col xs:flex-row gap-3">
          <Button onClick={handleConnect} disabled={isLoading} className="flex-1">
            {isLoading ? "Conectando..." : "Conectar"}
          </Button>
          <Button
            variant="outline"
            onClick={handleTriggerFlow}
            disabled={isLoading || !webhookUrl}
            className="flex-1"
          >
            Testar Fluxo
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-md">
          <p className="font-medium mb-1">Como configurar:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Crie um fluxo no n8n iniciando com um trigger de webhook</li>
            <li>Copie a URL do webhook gerado</li>
            <li>Cole a URL acima e clique em "Conectar"</li>
            <li>Configure as ações de automação no n8n para interagir com a API da plataforma</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
