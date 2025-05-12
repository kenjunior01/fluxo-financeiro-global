
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { AlertSettings } from "@/types";
import { AlertCircle, Bell, CreditCard, Eye, EyeOff, Key, Languages, Lock, Mail, User } from "lucide-react";

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Demo state for profile settings
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "********",
    language: "pt-BR",
    notifications: true,
  });
  
  // Demo state for alerts
  const [alerts, setAlerts] = useState<AlertSettings[]>([
    {
      priceTarget: 320.50,
      direction: "above",
      message: "PETR4 acima de 320.50",
      active: true,
      symbol: "PETR4.SA"
    },
    {
      priceTarget: 50000.00,
      direction: "below",
      message: "Bitcoin abaixo de 50.000",
      active: false,
      symbol: "BTCUSD"
    }
  ]);
  
  // Demo function to handle form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso."
    });
  };
  
  // Demo function to handle alert toggle
  const handleToggleAlert = (index: number) => {
    setAlerts(alerts.map((alert, i) => 
      i === index ? { ...alert, active: !alert.active } : alert
    ));
  };
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>
                      {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Alterar Foto</Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Tamanho máximo 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="name" 
                        value={profileForm.name}
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email"
                        value={profileForm.email}
                        onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                      <Select 
                        value={profileForm.language}
                        onValueChange={value => setProfileForm({...profileForm, language: value})}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Tipo de Conta</Label>
                    <Input id="role" value={currentUser?.role === 'trader' ? 'Trader' : 'Gestor de Conta'} disabled />
                    <p className="text-xs text-muted-foreground">
                      Entre em contato com o suporte para alterar seu tipo de conta
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={profileForm.notifications}
                    onCheckedChange={checked => setProfileForm({...profileForm, notifications: checked})}
                  />
                  <Label htmlFor="notifications">Receber notificações por email</Label>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Gerencie suas senhas e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="current-password" 
                    type="password" 
                    value="********" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="new-password" type="password" className="pl-10" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="confirm-password" type="password" className="pl-10" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      type="button"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Autenticação de Dois Fatores</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Login</CardTitle>
              <CardDescription>
                Dispositivos e locais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">Windows PC - Chrome</p>
                    <p className="text-xs text-muted-foreground">São Paulo, Brasil • Agora mesmo</p>
                  </div>
                  <Badge>Atual</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg">
                  <div>
                    <p className="font-medium">iPhone - Safari</p>
                    <p className="text-xs text-muted-foreground">São Paulo, Brasil • Ontem, 18:34</p>
                  </div>
                  <Button variant="outline" size="sm">Sair</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg">
                  <div>
                    <p className="font-medium">MacBook - Firefox</p>
                    <p className="text-xs text-muted-foreground">Rio de Janeiro, Brasil • 28/04/2025, 09:15</p>
                  </div>
                  <Button variant="outline" size="sm">Sair</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie como você recebe alertas e notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificações de Mercado</p>
                      <p className="text-sm text-muted-foreground">Alertas sobre mudanças significativas de preço</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificações de Conta</p>
                      <p className="text-sm text-muted-foreground">Alertas sobre atividades em sua conta</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificações de Posições</p>
                      <p className="text-sm text-muted-foreground">Alertas sobre suas posições abertas</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificações de Newsletter</p>
                      <p className="text-sm text-muted-foreground">Receba nossa newsletter semanal com análises</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Preço</CardTitle>
              <CardDescription>
                Configure alertas para movimentos de preço específicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className={`h-5 w-5 ${alert.active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.symbol} {alert.direction === 'above' ? 'acima de' : 'abaixo de'} R$ {alert.priceTarget}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={alert.active}
                      onCheckedChange={() => handleToggleAlert(index)}
                    />
                  </div>
                ))}
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Alerta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Gerencie seus métodos de pagamento para depósitos e saques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 5678</p>
                      <p className="text-xs text-muted-foreground">Mastercard • Expira em 08/26</p>
                    </div>
                  </div>
                  <Badge>Principal</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-xs text-muted-foreground">Visa • Expira em 05/27</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Definir como Principal</Button>
                </div>
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Cartão
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Visualize seu histórico recente de depósitos e saques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">Depósito</p>
                    <p className="text-xs text-muted-foreground">12/05/2025, 14:32</p>
                  </div>
                  <p className="font-medium text-profit">+ R$ 5.000,00</p>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">Saque</p>
                    <p className="text-xs text-muted-foreground">05/05/2025, 10:15</p>
                  </div>
                  <p className="font-medium text-loss">- R$ 2.500,00</p>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">Depósito</p>
                    <p className="text-xs text-muted-foreground">28/04/2025, 09:47</p>
                  </div>
                  <p className="font-medium text-profit">+ R$ 10.000,00</p>
                </div>
                
                <div className="flex justify-between items-center p-3">
                  <div>
                    <p className="font-medium">Saque</p>
                    <p className="text-xs text-muted-foreground">15/04/2025, 16:20</p>
                  </div>
                  <p className="font-medium text-loss">- R$ 3.200,00</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Ver Histórico Completo</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
