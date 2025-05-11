
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    
    await login(email, password);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Acesso à Plataforma</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar a plataforma de trading.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Senha</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Para testar a plataforma, use as seguintes credenciais:</p>
            <div className="mt-2 text-xs bg-secondary/50 p-2 rounded">
              <div><strong>Super Admin:</strong> joao@fluxofinanceiro.com</div>
              <div><strong>Admin:</strong> maria@fluxofinanceiro.com</div>
              <div><strong>Gestor de Contas:</strong> carlos@fluxofinanceiro.com</div>
              <div><strong>Trader:</strong> ana@exemplo.com</div>
              <div className="mt-1"><strong>Senha para todos:</strong> password</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
