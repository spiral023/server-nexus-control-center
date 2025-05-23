
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, DownloadCloud, RefreshCw } from "lucide-react";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import useServerStore from "@/store/serverStore";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ServerSyncControls = () => {
  const { servers, serverHistory, setServers } = useServerStore();
  const { syncState, syncToSupabase, loadFromSupabase } = useSupabaseSync(
    servers,
    serverHistory,
    setServers
  );
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { isLoading, lastSynced } = syncState;
  
  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    await syncToSupabase();
    setIsSyncing(false);
  };
  
  const handleLoadFromSupabase = async () => {
    setIsSyncing(true);
    await loadFromSupabase();
    setIsSyncing(false);
  };
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncToSupabase}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <UploadCloud className="h-4 w-4" />
              <span className="hidden sm:inline">Push to Supabase</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Push local data to Supabase</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoadFromSupabase}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <DownloadCloud className="h-4 w-4" />
              <span className="hidden sm:inline">Pull from Supabase</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load data from Supabase</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
      
      {lastSynced && (
        <span className="text-xs text-muted-foreground hidden md:inline">
          Last synced: {lastSynced.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ServerSyncControls;
