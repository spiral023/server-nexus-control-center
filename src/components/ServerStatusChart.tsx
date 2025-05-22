
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import useServerStore from "@/store/serverStore";
import { Server } from "@/types/server";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const ServerStatusChart = () => {
  const { servers } = useServerStore();
  const [serverTypeData, setServerTypeData] = useState<ChartData[]>([]);
  const [hardwareTypeData, setHardwareTypeData] = useState<ChartData[]>([]);
  const [backupStatusData, setBackupStatusData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Generate server type stats
    const serverTypeCounts: Record<string, number> = {};
    servers.forEach(server => {
      serverTypeCounts[server.serverType] = (serverTypeCounts[server.serverType] || 0) + 1;
    });
    
    const serverTypeChartData: ChartData[] = [
      { name: "Production", value: serverTypeCounts["Production"] || 0, color: "#10b981" },
      { name: "Test", value: serverTypeCounts["Test"] || 0, color: "#3b82f6" },
      { name: "Development", value: serverTypeCounts["Development"] || 0, color: "#f59e0b" },
      { name: "Staging", value: serverTypeCounts["Staging"] || 0, color: "#8b5cf6" },
      { name: "QA", value: serverTypeCounts["QA"] || 0, color: "#ec4899" },
    ].filter(item => item.value > 0);
    
    setServerTypeData(serverTypeChartData);
    
    // Generate hardware type stats
    const hardwareTypeCounts: Record<string, number> = {};
    servers.forEach(server => {
      hardwareTypeCounts[server.hardwareType] = (hardwareTypeCounts[server.hardwareType] || 0) + 1;
    });
    
    const hardwareTypeChartData: ChartData[] = [
      { name: "VMware", value: hardwareTypeCounts["VMware"] || 0, color: "#60a5fa" },
      { name: "Bare-Metal", value: hardwareTypeCounts["Bare-Metal"] || 0, color: "#fbbf24" },
    ].filter(item => item.value > 0);
    
    setHardwareTypeData(hardwareTypeChartData);
    
    // Generate backup status stats
    const backupStatusCounts: Record<string, number> = {};
    servers.forEach(server => {
      backupStatusCounts[server.backup] = (backupStatusCounts[server.backup] || 0) + 1;
    });
    
    const backupStatusChartData: ChartData[] = [
      { name: "With Backup", value: backupStatusCounts["Yes"] || 0, color: "#22c55e" },
      { name: "No Backup", value: backupStatusCounts["No"] || 0, color: "#ef4444" },
    ].filter(item => item.value > 0);
    
    setBackupStatusData(backupStatusChartData);
    
  }, [servers]);
  
  const renderPieChart = (data: ChartData[], innerRadius: number, outerRadius: number) => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [`${value} servers`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Server Types</CardTitle>
          <CardDescription>Distribution by environment</CardDescription>
        </CardHeader>
        <CardContent>
          {renderPieChart(serverTypeData, 0, 70)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Hardware Types</CardTitle>
          <CardDescription>Virtual vs. physical distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {renderPieChart(hardwareTypeData, 30, 70)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Backup Status</CardTitle>
          <CardDescription>Servers with enabled backups</CardDescription>
        </CardHeader>
        <CardContent>
          {renderPieChart(backupStatusData, 30, 70)}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStatusChart;
