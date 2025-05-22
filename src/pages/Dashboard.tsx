
import { Separator } from "@/components/ui/separator";
import ServerStats from "@/components/ServerStats";
import ServerStatusChart from "@/components/ServerStatusChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useServerStore from "@/store/serverStore";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { servers } = useServerStore();
  const [osDistribution, setOsDistribution] = useState<{name: string, count: number}[]>([]);
  
  useEffect(() => {
    // Calculate OS distribution
    const osCounts: Record<string, number> = {};
    servers.forEach(server => {
      // Group similar OSes
      let osGroup = server.operatingSystem;
      
      if (server.operatingSystem.includes('Windows')) {
        osGroup = 'Windows';
      } else if (server.operatingSystem.includes('Ubuntu') || 
                server.operatingSystem.includes('Debian')) {
        osGroup = 'Debian-based';
      } else if (server.operatingSystem.includes('Red Hat') || 
                server.operatingSystem.includes('CentOS')) {
        osGroup = 'RHEL-based';
      }
      
      osCounts[osGroup] = (osCounts[osGroup] || 0) + 1;
    });
    
    // Convert to chart data format
    const osData = Object.entries(osCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    setOsDistribution(osData);
  }, [servers]);
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Server Dashboard</h1>
        <p className="text-muted-foreground">
          Overview and statistics of the server infrastructure
        </p>
      </div>
      
      <ServerStats />
      
      <Separator />
      
      <h2 className="text-lg font-semibold">Server Distribution</h2>
      <ServerStatusChart />
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operating System Distribution</CardTitle>
            <CardDescription>
              Overview of installed operating systems across all servers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={osDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} servers`, 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
