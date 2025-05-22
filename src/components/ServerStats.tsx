
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Server } from "@/types/server";
import useServerStore from "@/store/serverStore";
import { Database, Server as ServerIcon, HardDrive, Check, AlertTriangle } from "lucide-react";

const ServerStats = () => {
  const { servers } = useServerStore();
  const [stats, setStats] = useState({
    totalServers: 0,
    vmwareServers: 0,
    bareMetalServers: 0,
    withBackup: 0,
    withoutBackup: 0,
  });
  
  useEffect(() => {
    const vmwareCount = servers.filter(server => server.hardwareType === 'VMware').length;
    const bareMetalCount = servers.filter(server => server.hardwareType === 'Bare-Metal').length;
    const withBackupCount = servers.filter(server => server.backup === 'Yes').length;
    const withoutBackupCount = servers.filter(server => server.backup === 'No').length;
    
    setStats({
      totalServers: servers.length,
      vmwareServers: vmwareCount,
      bareMetalServers: bareMetalCount,
      withBackup: withBackupCount,
      withoutBackup: withoutBackupCount,
    });
  }, [servers]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
          <ServerIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalServers}</div>
          <p className="text-xs text-muted-foreground pt-1">All registered systems</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Virtual Servers</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.vmwareServers}</div>
          <p className="text-xs text-muted-foreground pt-1">
            {((stats.vmwareServers / stats.totalServers) * 100).toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Physical Servers</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bareMetalServers}</div>
          <p className="text-xs text-muted-foreground pt-1">
            {((stats.bareMetalServers / stats.totalServers) * 100).toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">With Backup</CardTitle>
          <Check className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.withBackup}</div>
          <p className="text-xs text-muted-foreground pt-1">
            {((stats.withBackup / stats.totalServers) * 100).toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Without Backup</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.withoutBackup}</div>
          <p className="text-xs text-muted-foreground pt-1">
            {((stats.withoutBackup / stats.totalServers) * 100).toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStats;
