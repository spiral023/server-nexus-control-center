
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import SparklineChart from "@/components/SparklineChart";
import DoughnutChart from "@/components/DoughnutChart";
import useServerStore from "@/store/serverStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Server } from "@/types/server";

interface ServerStatsProps {
  className?: string;
  servers: Server[];
}

const ServerStats: React.FC<ServerStatsProps> = ({ className, servers }) => {
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
          <CardTitle>Server Gesamt</CardTitle>
          <CardDescription>Gesamtzahl der Server im Inventar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servers.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CPU-Auslastung</CardTitle>
          <CardDescription>Durchschnittliche CPU-Auslastung aller Server</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallCpuUsage.toFixed(1)}%</div>
          <SparklineChart data={cpuLoadData} color="#4ade80" label="CPU-Auslastung" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup-Status</CardTitle>
          <CardDescription>Server mit und ohne aktiviertes Backup</CardDescription>
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
          <CardTitle>Alarme</CardTitle>
          <CardDescription>Anzahl aktiver Alarme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servers.reduce((sum, server) => sum + server.alarmCount, 0)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStats;
