
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/services/mockData";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    // For this demo, we'll use our mock data
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === "password") { // Simple password check for demo
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo(a) de volta, ${user.name}!`
        });
        return true;
      } else {
        toast({
          title: "Falha na autenticação",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta"
    });
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
