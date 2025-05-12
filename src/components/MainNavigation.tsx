import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, LineChart, BarChart3, Users, Shield } from "lucide-react";

export function MainNavigation() {
  return (
    <div className="flex justify-between items-center py-6 px-4 md:px-8">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-1 rounded-md">
          <LineChart className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Fluxo Financeiro Global
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Plataforma</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/market"
                        className="flex h-full w-full flex-col justify-between rounded-md bg-gradient-to-b from-primary/10 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 rounded-full w-10 h-10 flex items-center justify-center bg-primary/10">
                          <LineChart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="mb-2 text-lg font-medium">
                          Mercado Global
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Acesse em tempo real os dados dos principais instrumentos financeiros do mercado.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem to="/dashboard" title="Dashboard" icon={BarChart3}>
                    Visão geral da sua conta e posições abertas
                  </ListItem>
                  <ListItem to="/positions" title="Posições" icon={LineChart}>
                    Gerencie suas posições abertas no mercado
                  </ListItem>
                  <ListItem to="/automation" title="Automação" icon={Shield}>
                    Estratégias automatizadas para trading
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/market" className={navigationMenuTriggerStyle()}>
                Mercados
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Sobre</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem
                    to="/about"
                    title="Sobre Nós"
                    icon={Users}
                  >
                    Conheça a equipe e nossa história
                  </ListItem>
                  <ListItem
                    to="/contact"
                    title="Contato"
                    icon={Users}
                  >
                    Entre em contato com nossa equipe
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Começar Agora</Link>
          </Button>
        </div>
      </div>

      <div className="md:hidden">
        <Button variant="ghost" size="icon">
          <span className="sr-only">Abrir menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

interface ListItemProps {
  to: string;
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}

const ListItem = ({ to, title, children, icon: Icon }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
