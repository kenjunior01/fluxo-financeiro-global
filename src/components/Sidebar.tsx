
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3, 
  LineChart, 
  Settings, 
  Users, 
  User, 
  Database,
  Server
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, active }: SidebarLinkProps) => (
  <Button
    variant={active ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start",
      active ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
    )}
    asChild
  >
    <Link to={href}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Link>
  </Button>
);

export const Sidebar = () => {
  const { currentUser, hasPermission } = useAuth();
  const location = useLocation();
  
  if (!currentUser) return null;
  
  return (
    <div className="h-screen bg-card border-r border-secondary w-60 p-4 flex flex-col">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold mb-2 px-4 text-primary">Menu</h2>
        <SidebarLink 
          href="/" 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={location.pathname === "/"} 
        />
        <SidebarLink 
          href="/market" 
          icon={LineChart} 
          label="Mercado" 
          active={location.pathname === "/market"} 
        />
        <SidebarLink 
          href="/positions" 
          icon={BarChart3} 
          label="Posições" 
          active={location.pathname === "/positions"} 
        />
        
        {hasPermission(["account_manager", "admin", "super_admin"]) && (
          <>
            <Separator className="my-4" />
            <h2 className="text-lg font-semibold mb-2 px-4 text-primary">Gestão</h2>
            <SidebarLink 
              href="/clients" 
              icon={User} 
              label="Clientes" 
              active={location.pathname === "/clients"} 
            />
            <SidebarLink 
              href="/automation" 
              icon={Server} 
              label="Automação" 
              active={location.pathname === "/automation"} 
            />
          </>
        )}
        
        {hasPermission(["admin", "super_admin"]) && (
          <>
            <Separator className="my-4" />
            <h2 className="text-lg font-semibold mb-2 px-4 text-primary">Administração</h2>
            <SidebarLink 
              href="/users" 
              icon={Users} 
              label="Usuários" 
              active={location.pathname === "/users"} 
            />
            <SidebarLink 
              href="/settings" 
              icon={Settings} 
              label="Configurações" 
              active={location.pathname === "/settings"} 
            />
          </>
        )}
        
        {hasPermission(["super_admin"]) && (
          <>
            <Separator className="my-4" />
            <h2 className="text-lg font-semibold mb-2 px-4 text-primary">Sistema</h2>
            <SidebarLink 
              href="/system" 
              icon={Database} 
              label="Sistema" 
              active={location.pathname === "/system"} 
            />
          </>
        )}
      </div>
    </div>
  );
};
