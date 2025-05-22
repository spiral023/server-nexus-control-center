
import { Separator } from "@/components/ui/separator";
import ServerStats from "@/components/ServerStats";
import ServerStatusChart from "@/components/ServerStatusChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ZAxis, 
  Treemap, Legend, Cell
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "lucide-react";
import useServerStore from "@/store/serverStore";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Interface for patch status data
interface PatchData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface AdminServerCount {
  name: string;
  count: number;
  threshold: string;
}

// Function to determine threshold color based on count
const getThresholdColor = (count: number): string => {
  if (count > 12) return 'text-destructive';
  if (count > 8) return 'text-amber-500';
  return 'text-green-500';
};

const Dashboard = () => {
  const { servers } = useServerStore();
  const [osDistribution, setOsDistribution] = useState<{name: string, count: number}[]>([]);
  const [patchDistribution, setPatchDistribution] = useState<PatchData[]>([]);
  const [serverGrowth, setServerGrowth] = useState<{name: string, count: number}[]>([]);
  const [hardwareDistribution, setHardwareDistribution] = useState<{date: string, virtual: number, physical: number}[]>([]);
  const [resourceData, setResourceData] = useState<{name: string, cpu: number, ram: number, storage: number}[]>([]);
  const [adminServerCounts, setAdminServerCounts] = useState<AdminServerCount[]>([]);
  const [serversByLocation, setServersByLocation] = useState<{name: string, servers: number}[]>([]);
  const [missingMaintenance, setMissingMaintenance] = useState<{name: string, value: number}[]>([]);
  
  // Filter states
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [serverTypeFilter, setServerTypeFilter] = useState<string>("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState<number[]>([0, 100]); // Percentage of time range
  
  // Get unique companies and locations
  const companies = [...new Set(servers.map(s => s.company))];
  const locations = [...new Set(servers.map(s => s.location))];
  const serverTypes = [...new Set(servers.map(s => s.serverType))];
  
  // Apply filters to servers
  const getFilteredServers = () => {
    return servers.filter(server => {
      // Apply location filter
      if (locationFilter !== "all" && server.location !== locationFilter) {
        return false;
      }
      
      // Apply company filter
      if (companyFilter !== "all" && server.company !== companyFilter) {
        return false;
      }
      
      // Apply server type filter
      if (serverTypeFilter !== "all" && server.serverType !== serverTypeFilter) {
        return false;
      }
      
      // Apply time range filter if needed
      // This would filter based on creation date or some other time-based attribute
      
      return true;
    });
  };
  
  useEffect(() => {
    const filteredServers = getFilteredServers();
    
    // Calculate OS distribution
    const osCounts: Record<string, number> = {};
    filteredServers.forEach(server => {
      // Group similar OSes
      let osGroup = server.operatingSystem;
      
      if (server.operatingSystem.includes('Windows')) {
        osGroup = 'Windows';
      } else if (server.operatingSystem.includes('Ubuntu') || 
                server.operatingSystem.includes('Debian')) {
        osGroup = 'Debian-basiert';
      } else if (server.operatingSystem.includes('Red Hat') || 
                server.operatingSystem.includes('CentOS')) {
        osGroup = 'RHEL-basiert';
      }
      
      osCounts[osGroup] = (osCounts[osGroup] || 0) + 1;
    });
    
    // Convert to chart data format
    const osData = Object.entries(osCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    setOsDistribution(osData);
    
    // Calculate patch status distribution
    const patchCounts: Record<string, number> = {
      'aktuell': 0,
      'veraltet': 0,
      'kritisch': 0
    };
    
    filteredServers.forEach(server => {
      patchCounts[server.patchStatus] = (patchCounts[server.patchStatus] || 0) + 1;
    });
    
    const total = filteredServers.length;
    const patchData: PatchData[] = [
      { 
        name: 'Aktuell (< 30 Tage)', 
        value: patchCounts['aktuell'], 
        percentage: (patchCounts['aktuell'] / total) * 100,
        color: '#10b981' 
      },
      { 
        name: 'Veraltet (30-90 Tage)', 
        value: patchCounts['veraltet'], 
        percentage: (patchCounts['veraltet'] / total) * 100,
        color: '#f59e0b' 
      },
      { 
        name: 'Kritisch (> 90 Tage)', 
        value: patchCounts['kritisch'], 
        percentage: (patchCounts['kritisch'] / total) * 100,
        color: '#ef4444' 
      }
    ];
    
    setPatchDistribution(patchData);
    
    // Generate server growth data by month
    const growthData: Record<string, number> = {};
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(currentDate.getFullYear() - 1); // Last 12 months
    
    // Initialize all months with zero
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
      growthData[monthYear] = 0;
    }
    
    // Count servers created in each month
    filteredServers.forEach(server => {
      const createdAt = new Date(server.createdAt);
      if (createdAt >= startDate && createdAt <= currentDate) {
        const monthYear = `${createdAt.getMonth() + 1}/${createdAt.getFullYear().toString().slice(-2)}`;
        growthData[monthYear] = (growthData[monthYear] || 0) + 1;
      }
    });
    
    // Convert to cumulative growth
    let cumulativeCount = 0;
    const growthChartData = Object.entries(growthData).map(([name, count]) => {
      cumulativeCount += count;
      return { name, count: cumulativeCount };
    });
    
    setServerGrowth(growthChartData);
    
    // Calculate hardware distribution over time
    const hardwareData: Record<string, { virtual: number, physical: number }> = {};
    
    // Initialize with quarterly data points
    const quarters = 8; // 2 years of quarterly data
    const quarterLabels = [];
    
    for (let i = 0; i < quarters; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + (i * 3)); // Every 3 months
      const quarterLabel = `Q${Math.floor(date.getMonth() / 3) + 1}/${date.getFullYear().toString().slice(-2)}`;
      quarterLabels.push(quarterLabel);
      hardwareData[quarterLabel] = { virtual: 0, physical: 0 };
    }
    
    // Calculate cumulative growth by hardware type and quarter
    filteredServers.forEach(server => {
      const createdAt = new Date(server.createdAt);
      quarterLabels.forEach(label => {
        const [quarter, year] = label.split('/');
        const quarterNum = parseInt(quarter.substring(1)) - 1; // Convert Q1 to 0
        const fullYear = 2000 + parseInt(year); // Convert YY to YYYY
        
        const quarterDate = new Date(fullYear, quarterNum * 3, 1); // First day of quarter
        
        if (createdAt <= quarterDate) {
          if (server.hardwareType === 'VMware') {
            hardwareData[label].virtual += 1;
          } else {
            hardwareData[label].physical += 1;
          }
        }
      });
    });
    
    const hardwareChartData = Object.entries(hardwareData).map(([date, counts]) => ({
      date,
      virtual: counts.virtual,
      physical: counts.physical
    }));
    
    setHardwareDistribution(hardwareChartData);
    
    // Calculate resource distribution (CPU vs RAM)
    const resourceChartData = filteredServers.map(server => ({
      name: server.serverName,
      cpu: server.cores,
      ram: server.ramGB,
      storage: server.storageGB,
      location: server.location
    }));
    
    setResourceData(resourceChartData);
    
    // Calculate servers per admin
    const adminCounts: Record<string, number> = {};
    filteredServers.forEach(server => {
      adminCounts[server.systemAdmin] = (adminCounts[server.systemAdmin] || 0) + 1;
    });
    
    const adminData = Object.entries(adminCounts)
      .map(([name, count]) => ({ 
        name, 
        count,
        threshold: getThresholdColor(count)
      }))
      .sort((a, b) => b.count - a.count);
    
    setAdminServerCounts(adminData);
    
    // Calculate servers by location
    const locationCounts: Record<string, number> = {};
    filteredServers.forEach(server => {
      locationCounts[server.location] = (locationCounts[server.location] || 0) + 1;
    });
    
    const locationData = Object.entries(locationCounts)
      .map(([name, servers]) => ({ name, servers }));
    
    setServersByLocation(locationData);
    
    // Calculate servers missing maintenance window
    const serversWithoutMaintenance = filteredServers.filter(
      server => !server.maintenanceWindow || server.maintenanceWindow === 'Unbekannt'
    );
    
    // Group by OS
    const missingMaintenanceCounts: Record<string, number> = {};
    serversWithoutMaintenance.forEach(server => {
      let osGroup = server.operatingSystem;
      if (server.operatingSystem.includes('Windows')) {
        osGroup = 'Windows';
      } else if (server.operatingSystem.includes('Ubuntu') || 
                server.operatingSystem.includes('Debian')) {
        osGroup = 'Debian-basiert';
      } else if (server.operatingSystem.includes('Red Hat') || 
                server.operatingSystem.includes('CentOS')) {
        osGroup = 'RHEL-basiert';
      }
      
      missingMaintenanceCounts[osGroup] = (missingMaintenanceCounts[osGroup] || 0) + 1;
    });
    
    const missingMaintenanceData = Object.entries(missingMaintenanceCounts)
      .map(([name, value]) => ({ name, value }));
    
    setMissingMaintenance(missingMaintenanceData);
    
  }, [servers, locationFilter, companyFilter, serverTypeFilter, timeRangeFilter]);
  
  // Custom colors for location data
  const LOCATION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Server Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht und Statistiken der Server-Infrastruktur
        </p>
      </div>
      
      {/* Filter bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Standort</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Standort auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Standorte</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Firma</label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Firma auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Firmen</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Servertyp</label>
              <Select value={serverTypeFilter} onValueChange={setServerTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Servertyp auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  {serverTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ServerStats />
      
      <Separator />
      
      {/* Server Distribution */}
      <h2 className="text-lg font-semibold">Server Verteilung</h2>
      <ServerStatusChart />
      
      <Separator />
      
      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patch Status Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>Patch-Aktualität</CardTitle>
            <CardDescription>
              Verteilung nach Patch-Status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={patchDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: '%', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${props.payload.value} Server (${props.payload.percentage.toFixed(1)}%)`,
                      'Anzahl'
                    ]}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {patchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Servers without maintenance window */}
        <Card>
          <CardHeader>
            <CardTitle>Server ohne Wartungsfenster</CardTitle>
            <CardDescription>
              Gruppiert nach Betriebssystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={missingMaintenance}
                  dataKey="value"
                  nameKey="name"
                  aspectRatio={4/3}
                >
                  {missingMaintenance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* OS Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Betriebssystem-Verteilung</CardTitle>
            <CardDescription>
              Übersicht der installierten Betriebssysteme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                windows: { color: "#3b82f6" },
                linux: { color: "#10b981" },
                other: { color: "#f59e0b" },
              }}
              className="h-80"
            >
              <BarChart data={osDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Server Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Server-Wachstum pro Monat</CardTitle>
            <CardDescription>
              Basierend auf Erstelldatum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serverGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} Server`, 'Gesamtzahl']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Virtual vs Physical over time */}
        <Card>
          <CardHeader>
            <CardTitle>Virtuelle vs. Physische Server</CardTitle>
            <CardDescription>
              Entwicklung im Zeitverlauf
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hardwareDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} Server`,
                      name === 'virtual' ? 'Virtual' : 'Physisch'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="virtual" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    name="Virtual"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="physical" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    name="Physisch"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Resources Bubble Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>CPU vs. RAM vs. Storage</CardTitle>
            <CardDescription>
              Größe = Storage, Farbe = Standort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="cpu" 
                    name="CPU Cores" 
                    label={{ value: 'CPU Cores', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    dataKey="ram" 
                    name="RAM (GB)" 
                    label={{ value: 'RAM (GB)', angle: -90, position: 'left' }}
                  />
                  <ZAxis 
                    dataKey="storage" 
                    range={[60, 400]} 
                    name="Storage (GB)"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                      if (name === 'CPU Cores') return [value, name];
                      if (name === 'RAM (GB)') return [value, name];
                      if (name === 'Storage (GB)') return [props.payload.storage, name];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Server: ${props.resourceData.find(s => s.name === label)?.name}`}
                  />
                  <Legend />
                  <Scatter
                    name="Server"
                    data={resourceData}
                  >
                    {resourceData.map((entry, index) => {
                      const locationIndex = locations.indexOf(entry.location) % LOCATION_COLORS.length;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={LOCATION_COLORS[locationIndex >= 0 ? locationIndex : 0]} 
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center mt-4 gap-4">
              {locations.map((location, index) => (
                <div key={location} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: LOCATION_COLORS[index % LOCATION_COLORS.length] }}
                  />
                  <span className="text-sm">{location}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Most alarmed servers */}
        <Card>
          <CardHeader>
            <CardTitle>Server mit Alarmen</CardTitle>
            <CardDescription>
              Top 5 Server mit den meisten Alarmen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servers
                .filter(server => server.alarmCount > 0)
                .sort((a, b) => b.alarmCount - a.alarmCount)
                .slice(0, 5)
                .map((server) => (
                  <div key={server.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${server.alarmCount > 2 ? 'border-destructive text-destructive' : 'border-amber-500 text-amber-500'}`}
                      >
                        {server.alarmCount}
                      </Badge>
                      <span className="font-medium">{server.serverName}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{server.hardwareType}</span>
                  </div>
                ))
              }
              
              {servers.filter(server => server.alarmCount > 0).length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Keine Alarme vorhanden
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Servers per admin */}
        <Card>
          <CardHeader>
            <CardTitle>Server pro Systemadministrator</CardTitle>
            <CardDescription>
              Überlastungen identifizieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={adminServerCounts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => [`${value} Server`, 'Anzahl']} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {adminServerCounts.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.threshold === 'text-destructive' ? '#ef4444' :
                          entry.threshold === 'text-amber-500' ? '#f59e0b' : 
                          '#10b981'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
