
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Search, ChevronRight, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    position: "5 posições",
    investedValue: 50000,
    profitLoss: 2500,
    profitPercent: 5,
    lastActivity: "Hoje, 14:32",
    status: "active"
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    position: "3 posições",
    investedValue: 75000,
    profitLoss: -1800,
    profitPercent: -2.4,
    lastActivity: "Ontem, 09:15",
    status: "active"
  },
  {
    id: "3",
    name: "Carlos Mendes",
    email: "carlos.mendes@example.com",
    position: "8 posições",
    investedValue: 120000,
    profitLoss: 8900,
    profitPercent: 7.4,
    lastActivity: "28/04/2025",
    status: "active"
  },
  {
    id: "4",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    position: "2 posições",
    investedValue: 25000,
    profitLoss: 750,
    profitPercent: 3,
    lastActivity: "25/04/2025",
    status: "inactive"
  },
  {
    id: "5",
    name: "Lucas Souza",
    email: "lucas.souza@example.com",
    position: "0 posições",
    investedValue: 0,
    profitLoss: 0,
    profitPercent: 0,
    lastActivity: "20/03/2025",
    status: "pending"
  },
];

const Clients = () => {
  const [clients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && client.status === "active") ||
      (activeTab === "inactive" && client.status === "inactive") ||
      (activeTab === "pending" && client.status === "pending");
    
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button>
          <User className="mr-2 h-4 w-4" /> 
          Adicionar Cliente
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar clientes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos os Clientes</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie seus clientes e suas carteiras de investimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Cliente</TableHead>
                <TableHead>Posições</TableHead>
                <TableHead className="text-right">Valor Investido</TableHead>
                <TableHead className="text-right">Lucro/Prejuízo</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.position}</TableCell>
                    <TableCell className="text-right">
                      {client.investedValue > 0 
                        ? `R$ ${client.investedValue.toLocaleString('pt-BR')}` 
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {client.investedValue > 0 ? (
                        <div className={client.profitLoss >= 0 ? 'text-profit' : 'text-loss'}>
                          R$ {Math.abs(client.profitLoss).toLocaleString('pt-BR')}
                          <span className="text-xs ml-1">
                            ({client.profitLoss >= 0 ? '+' : '-'}{Math.abs(client.profitPercent)}%)
                          </span>
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{client.lastActivity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.status === "active" ? "default" :
                          client.status === "inactive" ? "secondary" : "outline"
                        }
                      >
                        {client.status === "active" ? "Ativo" :
                         client.status === "inactive" ? "Inativo" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                          <DropdownMenuItem>Gerenciar carteira</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Desativar cliente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total de Clientes</span>
                <span className="font-bold">{clients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Clientes Ativos</span>
                <span className="font-bold">{clients.filter(c => c.status === "active").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Clientes Inativos</span>
                <span className="font-bold">{clients.filter(c => c.status === "inactive").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pendentes</span>
                <span className="font-bold">{clients.filter(c => c.status === "pending").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Desempenho da Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Investido</span>
                <span className="font-bold">
                  R$ {clients.reduce((sum, client) => sum + client.investedValue, 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lucro Total</span>
                <span className="font-bold text-profit">
                  R$ {clients.reduce((sum, client) => sum + Math.max(0, client.profitLoss), 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prejuízo Total</span>
                <span className="font-bold text-loss">
                  R$ {Math.abs(clients.reduce((sum, client) => sum + Math.min(0, client.profitLoss), 0)).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Clientes Lucrativos</span>
                <span className="font-bold">{clients.filter(c => c.profitLoss > 0).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Adicionar Novo Cliente
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChevronRight className="mr-2 h-4 w-4" />
                Gerenciar Carteiras
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChevronRight className="mr-2 h-4 w-4" />
                Enviar Relatório para Clientes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ChevronRight className="mr-2 h-4 w-4" />
                Configurar Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Clients;
