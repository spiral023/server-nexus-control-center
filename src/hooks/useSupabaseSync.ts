
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Server, ServerHistory } from "@/types/server";
import * as serverService from "@/services/serverService";

interface SyncState {
  isLoading: boolean;
  lastSynced: Date | null;
}

export const useSupabaseSync = (
  servers: Server[],
  history: Record<string, ServerHistory[]>,
  setServers: (servers: Server[]) => void
) => {
  const [syncState, setSyncState] = useState<SyncState>({
    isLoading: false,
    lastSynced: null
  });
  
  const { toast } = useToast();
  
  // Sync local data to Supabase
  const syncToSupabase = async () => {
    setSyncState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Sync servers
      await serverService.syncServersToSupabase(servers);
      
      // Sync history
      await serverService.syncHistoryToSupabase(history);
      
      setSyncState({
        isLoading: false,
        lastSynced: new Date()
      });
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${servers.length} servers to Supabase.`,
      });
    } catch (error) {
      console.error("Error during sync:", error);
      
      toast({
        title: "Sync Failed",
        description: `Failed to sync data to Supabase: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
      
      setSyncState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Load data from Supabase
  const loadFromSupabase = async () => {
    setSyncState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Fetch servers from Supabase
      const fetchedServers = await serverService.fetchServers();
      
      // Update local store
      setServers(fetchedServers);
      
      setSyncState({
        isLoading: false,
        lastSynced: new Date()
      });
      
      toast({
        title: "Load Complete",
        description: `Loaded ${fetchedServers.length} servers from Supabase.`,
      });
    } catch (error) {
      console.error("Error loading from Supabase:", error);
      
      toast({
        title: "Load Failed",
        description: `Failed to load data from Supabase: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
      
      setSyncState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  return {
    syncState,
    syncToSupabase,
    loadFromSupabase
  };
};
