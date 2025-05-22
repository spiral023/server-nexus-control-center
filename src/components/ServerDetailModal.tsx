
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getServerTypeColor, getHardwareTypeColor } from "@/lib/utils";
import useServerStore from "@/store/serverStore";
import { Edit, Trash2, History } from "lucide-react";
import ServerHistoryTable from "./ServerHistoryTable";
import { useState } from "react";
import SparklineChart from "./SparklineChart";

const ServerDetailModal = () => {
  const { 
    selectedServer, 
    isModalOpen, 
    closeModal, 
    serverHistory,
    openForm,
    deleteServer
  } = useServerStore();
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Handle when there's no selected server
  if (!selectedServer) {
    return null;
  }
  
  const serverHistoryEntries = serverHistory[selectedServer.id] || [];
  
  // Get color based on patch status
  const getPatchStatusColor = (status: string) => {
    switch(status) {
      case 'aktuell': return "text-green-500";
      case 'veraltet': return "text-amber-500";
      case 'kritisch': return "text-destructive";
      default: return "text-muted-foreground";
    }
  };
  
  // Format server info for display
  const serverInfo = [
    { label: "Server Name", value: selectedServer.serverName },
    { label: "Betriebssystem", value: selectedServer.operatingSystem },
    { label: "Hardware Typ", value: <Badge variant="outline" className={getHardwareTypeColor(selectedServer.hardwareType)}>{selectedServer.hardwareType}</Badge> },
    { label: "Unternehmen", value: selectedServer.company },
    { label: "Server Typ", value: <Badge className={getServerTypeColor(selectedServer.serverType)}>{selectedServer.serverType}</Badge> },
    { label: "Standort", value: selectedServer.location },
    { label: "Systemadministrator", value: selectedServer.systemAdmin },
    { label: "Backup Administrator", value: selectedServer.backupAdmin },
    { label: "Hardware Administrator", value: selectedServer.hardwareAdmin },
    { label: "Beschreibung", value: selectedServer.description },
    { label: "Domäne", value: selectedServer.domain },
    { label: "Wartungsfenster", value: selectedServer.maintenanceWindow || "Nicht definiert" },
    { label: "IP-Adresse", value: selectedServer.ipAddress },
    { label: "Anwendungszone", value: selectedServer.applicationZone },
    { label: "Betriebszone", value: selectedServer.operationalZone },
    { label: "Backup", value: selectedServer.backup },
    { label: "CPU Cores", value: selectedServer.cores },
    { label: "RAM (GB)", value: selectedServer.ramGB },
    { label: "Storage (GB)", value: selectedServer.storageGB },
    { 
      label: "vSphere Cluster", 
      value: selectedServer.vsphereCluster || "Nicht zutreffend",
      condition: selectedServer.hardwareType === "VMware"
    },
    { label: "Anwendung", value: selectedServer.application },
    { 
      label: "Patch Status", 
      value: <span className={getPatchStatusColor(selectedServer.patchStatus)}>{selectedServer.patchStatus}</span> 
    },
    { label: "Letztes Patch Datum", value: formatDate(selectedServer.lastPatchDate) },
    { label: "Erstellt am", value: formatDate(selectedServer.createdAt, true) },
    { label: "Aktualisiert am", value: formatDate(selectedServer.updatedAt, true) },
    { label: "Aktualisiert von", value: selectedServer.updatedBy },
  ].filter(info => info.condition !== false);
  
  const handleEdit = () => {
    openForm('edit');
    closeModal();
  };
  
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    deleteServer(selectedServer.id);
    closeModal();
    setConfirmDelete(false);
  };
  
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => {
      if (!open) {
        closeModal();
        setConfirmDelete(false);
      }
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{selectedServer.serverName}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" /> Bearbeiten
              </Button>
              <Button 
                size="sm" 
                variant={confirmDelete ? "destructive" : "outline"} 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> 
                {confirmDelete ? "Bestätigen" : "Löschen"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Server Details</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-1" /> Verlauf ({serverHistoryEntries.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            {/* CPU Load Trend */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">CPU Auslastung (24h)</div>
                <div className="text-sm font-medium">
                  Aktuell: {selectedServer.cpuLoadTrend?.[selectedServer.cpuLoadTrend.length - 1] || 0}%
                </div>
              </div>
              <SparklineChart 
                data={selectedServer.cpuLoadTrend || []} 
                height={60}
                color={
                  selectedServer.cpuLoadTrend?.[selectedServer.cpuLoadTrend.length - 1] > 80 ? '#ef4444' :
                  selectedServer.cpuLoadTrend?.[selectedServer.cpuLoadTrend.length - 1] > 60 ? '#f59e0b' :
                  '#10b981'
                }
              />
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serverInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">{info.label}</div>
                  <div className="font-medium">{info.value}</div>
                </div>
              ))}
            </div>
            
            {selectedServer.tags && selectedServer.tags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedServer.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-tag/10 text-tag border border-tag/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <ServerHistoryTable serverId={selectedServer.id} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={closeModal}>Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServerDetailModal;
