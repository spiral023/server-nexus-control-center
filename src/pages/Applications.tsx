
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Server } from "@/types/server";
import useServerStore from "@/store/serverStore";
import { getServerTypeColor } from "@/lib/utils";

// Group servers by application
const Applications = () => {
  const { servers } = useServerStore();
  const [applicationGroups, setApplicationGroups] = useState<Record<string, Server[]>>({});
  const [activeApplication, setActiveApplication] = useState<string | null>(null);

  useEffect(() => {
    const groups: Record<string, Server[]> = {};
    
    servers.forEach((server) => {
      if (server.application) {
        if (!groups[server.application]) {
          groups[server.application] = [];
        }
        groups[server.application].push(server);
      }
    });
    
    // Sort applications by name
    const sortedGroups = Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    );
    
    setApplicationGroups(sortedGroups);
    
    // Set first application as active if none selected
    if (!activeApplication && Object.keys(sortedGroups).length > 0) {
      setActiveApplication(Object.keys(sortedGroups)[0]);
    }
  }, [servers, activeApplication]);

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Anwendungen</h1>
        <p className="text-muted-foreground">
          Übersicht aller Server nach Anwendung gruppiert
        </p>
      </div>
      
      {Object.keys(applicationGroups).length > 0 ? (
        <Tabs 
          defaultValue={activeApplication || Object.keys(applicationGroups)[0]} 
          onValueChange={setActiveApplication}
          className="space-y-4"
        >
          <ScrollArea className="w-full">
            <div className="flex p-1">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                {Object.keys(applicationGroups).map((appName) => (
                  <TabsTrigger
                    key={appName}
                    value={appName}
                    className="whitespace-nowrap"
                  >
                    {appName} ({applicationGroups[appName].length})
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </ScrollArea>
          
          {Object.entries(applicationGroups).map(([appName, appServers]) => (
            <TabsContent key={appName} value={appName} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appServers.map((server) => (
                  <Card key={server.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{server.serverName}</CardTitle>
                          <CardDescription>{server.description}</CardDescription>
                        </div>
                        <Badge className={getServerTypeColor(server.serverType)}>
                          {server.serverType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Betriebssystem:</span>
                          <p className="font-medium">{server.operatingSystem}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hardwaretyp:</span>
                          <p className="font-medium">{server.hardwareType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Standort:</span>
                          <p className="font-medium">{server.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Firma:</span>
                          <p className="font-medium">{server.company}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ressourcen:</span>
                          <p className="font-medium">{server.cores} CPU, {server.ramGB} GB RAM</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Storage:</span>
                          <p className="font-medium">{server.storageGB} GB</p>
                        </div>
                        {server.vsphereCluster && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">vSphere Cluster:</span>
                            <p className="font-medium">{server.vsphereCluster}</p>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <div>
                          <span className="text-muted-foreground text-xs">Systemadmin</span>
                          <p className="text-sm">{server.systemAdmin}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">IP-Adresse</span>
                          <p className="text-sm font-mono">{server.ipAddress}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Keine Anwendungen gefunden.</p>
          <p className="text-sm mt-2">Bitte weisen Sie den Servern Anwendungen zu.</p>
        </Card>
      )}
    </div>
  );
};

export default Applications;
