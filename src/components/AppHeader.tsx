
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, LogOut, Settings } from "lucide-react";

export const AppHeader = () => {
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) return null;
  
  const userInitials = currentUser.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  const roleLabel = {
    super_admin: "Super Admin",
    admin: "Administrador",
    account_manager: "Gestor de Contas", 
    trader: "Trader"
  }[currentUser.role];
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-secondary bg-card">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-primary">Fluxo Financeiro Global</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-sm text-muted-foreground">{roleLabel}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
