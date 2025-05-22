
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getServerTypeColor, getHardwareTypeColor } from "@/lib/utils";
import useServerStore from "@/store/serverStore";
import { Edit, Trash2, History } from "lucide-react";
import ServerHistoryTable from "./ServerHistoryTable";
import { useState } from "react";
import ServerForm from "./ServerForm";

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
  
  // Format server info for display
  const serverInfo = [
    { label: "Server Name", value: selectedServer.serverName },
    { label: "Operating System", value: selectedServer.operatingSystem },
    { label: "Hardware Type", value: <Badge variant="outline" className={getHardwareTypeColor(selectedServer.hardwareType)}>{selectedServer.hardwareType}</Badge> },
    { label: "Company", value: selectedServer.company },
    { label: "Server Type", value: <Badge className={getServerTypeColor(selectedServer.serverType)}>{selectedServer.serverType}</Badge> },
    { label: "Location", value: selectedServer.location },
    { label: "System Administrator", value: selectedServer.systemAdmin },
    { label: "Backup Administrator", value: selectedServer.backupAdmin },
    { label: "Hardware Administrator", value: selectedServer.hardwareAdmin },
    { label: "Description", value: selectedServer.description },
    { label: "Domain", value: selectedServer.domain },
    { label: "Maintenance Window", value: selectedServer.maintenanceWindow },
    { label: "IP Address", value: selectedServer.ipAddress },
    { label: "Application Zone", value: selectedServer.applicationZone },
    { label: "Operational Zone", value: selectedServer.operationalZone },
    { label: "Backup", value: selectedServer.backup },
    { label: "Created At", value: formatDate(selectedServer.createdAt, true) },
    { label: "Updated At", value: formatDate(selectedServer.updatedAt, true) },
    { label: "Updated By", value: selectedServer.updatedBy },
  ];
  
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{selectedServer.serverName}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button 
                size="sm" 
                variant={confirmDelete ? "destructive" : "outline"} 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> 
                {confirmDelete ? "Confirm" : "Delete"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Server Details</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-1" /> History ({serverHistoryEntries.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServerDetailModal;
