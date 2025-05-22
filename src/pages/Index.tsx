import ServerTable from "@/components/ServerTable";
import ServerPagination from "@/components/ServerPagination";
import ServerForm from "@/components/ServerForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useServerStore from "@/store/serverStore";
import { ServerFilter } from "@/types/server";
import { useDisclosure } from "@/components/ui/use-disclosure";

// Predefined views for different user types
const predefinedViews = [
  {
    id: "sysadmin",
    name: "Systemadministrator",
    filters: [] as ServerFilter[],
    columns: [
      "serverName", "operatingSystem", "hardwareType", "location", 
      "ipAddress", "cores", "ramGB", "storageGB", "vsphereCluster", "backup"
    ]
  },
  {
    id: "network",
    name: "Netzwerk",
    filters: [] as ServerFilter[],
    columns: [
      "serverName", "ipAddress", "applicationZone", "operationalZone", 
      "domain", "location", "systemAdmin"
    ]
  },
  {
    id: "finance",
    name: "Buchhaltung",
    filters: [] as ServerFilter[],
    columns: [
      "serverName", "company", "serverType", "hardwareType", 
      "cores", "ramGB", "storageGB", "location"
    ]
  },
  {
    id: "lifecycle",
    name: "Lifecycle-Management",
    filters: [] as ServerFilter[],
    columns: [
      "serverName", "operatingSystem", "patchStatus", "lastPatchDate", 
      "createdAt", "maintenanceWindow", "systemAdmin"
    ]
  },
  {
    id: "audit",
    name: "Auditing",
    filters: [] as ServerFilter[],
    columns: [
      "serverName", "serverType", "operatingSystem", "backup", 
      "updatedAt", "updatedBy", "patchStatus"
    ]
  }
];

const Index = () => {
  const { setVisibleColumns, addServer } = useServerStore();
  const [activeView, setActiveView] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Apply predefined view when selected
  const applyPredefinedView = (viewId: string) => {
    const view = predefinedViews.find(v => v.id === viewId);
    if (view) {
      setVisibleColumns(view.columns as any);
      setActiveView(viewId);
    }
  };

  const handleSubmit = (values: any) => {
    addServer(values);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Server Inventar</h1>
          <p className="text-muted-foreground">Verwaltung aller Server-Systeme</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="text-sm text-muted-foreground mr-2 self-center">Vordefinierte Ansichten:</div>
          {predefinedViews.map(view => (
            <Button 
              key={view.id}
              variant={activeView === view.id ? "default" : "outline"}
              size="sm"
              onClick={() => applyPredefinedView(view.id)}
            >
              {view.name}
            </Button>
          ))}
        </div>
      </div>
      
      <ServerTable />
      <ServerPagination />
      {isOpen && <ServerForm onSubmit={handleSubmit} onCancel={handleCancel} />}
      <Button onClick={onOpen}>Neuen Server hinzufügen</Button>
    </div>
  );
};

export default Index;
