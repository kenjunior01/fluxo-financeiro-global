
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import { MarketProvider } from "@/contexts/MarketContext";

const Index = () => {
  return (
    <AuthProvider>
      <MarketProvider>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </MarketProvider>
    </AuthProvider>
  );
};

export default Index;
