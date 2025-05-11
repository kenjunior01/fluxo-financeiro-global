
import { MarketOverview } from "@/components/MarketOverview";
import { PositionsTable } from "@/components/PositionsTable";
import { MarketNews } from "@/components/MarketNews";

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <MarketOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-full lg:col-span-2">
          <PositionsTable />
        </div>
        <div>
          <MarketNews />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
