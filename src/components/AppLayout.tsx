
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { AppHeader } from "@/components/AppHeader";
import { PriceTickerBar } from "@/components/PriceTickerBar";
import { LoginForm } from "@/components/LoginForm";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const AppLayout = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}: AppLayoutProps) => {
  const { currentUser, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // Log page views for analytics (would connect to analytics service in a real app)
  useEffect(() => {
    if (currentUser) {
      console.log(`Page viewed: ${location.pathname} by ${currentUser.email}`);
    }
  }, [location.pathname, currentUser]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-pulse-subtle text-2xl font-bold text-primary mb-2">
            Carregando...
          </div>
          <p className="text-muted-foreground">
            Preparando sua plataforma de trading
          </p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoginForm />
      </div>
    );
  }

  // If role check is required
  if (
    requireAuth &&
    currentUser &&
    allowedRoles.length > 0 &&
    !hasPermission(allowedRoles)
  ) {
    return <Navigate to="/" replace />;
  }

  // Main layout for authenticated users
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <PriceTickerBar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
