import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DoughnutChart, SparklineChart } from "@/components";
import { useServers } from "@/store/serverStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ServerStatsProps {
  className?: string;
}

const ServerStats: React.FC<ServerStatsProps> = ({ className }) => {
  const servers = useServers(state => state.servers);

  // Calculate total CPU usage
  const totalCores = servers.reduce((sum, server) => sum + server.cores, 0);
  const totalCpuUsage = servers.reduce((sum, server) => {
    const latestCpuLoad = server.cpuLoadTrend[server.cpuLoadTrend.length - 1];
    return sum + (latestCpuLoad / 100) * server.cores;
  }, 0);
  const overallCpuUsage = totalCores > 0 ? (totalCpuUsage / totalCores) * 100 : 0;

  // Prepare data for the doughnut chart
  const backupData = [
    { name: 'Ja', value: servers.filter(server => server.backup === 'Ja').length },
    { name: 'Nein', value: servers.filter(server => server.backup === 'Nein').length }
  ];

  // Prepare CPU load data for the sparkline chart
  const cpuLoadData = servers.map(server => server.cpuLoadTrend[server.cpuLoadTrend.length - 1]);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Total Servers</CardTitle>
          <CardDescription>Total number of servers in the inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servers.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall CPU Usage</CardTitle>
          <CardDescription>Aggregated CPU usage across all servers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallCpuUsage.toFixed(1)}%</div>
          <SparklineChart data={cpuLoadData} color="#4ade80" label="CPU Usage" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Status</CardTitle>
          <CardDescription>Servers with and without backup enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <DoughnutChart data={backupData} />
          <div className="flex justify-around mt-4">
            <Badge variant="secondary">
              Ja: {backupData[0].value}
            </Badge>
            <Badge variant="destructive">
              Nein: {backupData[1].value}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alarms</CardTitle>
          <CardDescription>Total number of active alarms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servers.reduce((sum, server) => sum + server.alarmCount, 0)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStats;
