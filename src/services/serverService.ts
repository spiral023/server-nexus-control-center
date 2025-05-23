
import { supabase } from "@/integrations/supabase/client";
import { Server, ServerHistory } from "@/types/server";
import { v4 as uuidv4 } from "uuid";

// Function to convert frontend Server object to Supabase format
const toSupabaseServer = (server: Server) => {
  return {
    id: server.id,
    server_name: server.serverName,
    operating_system: server.operatingSystem,
    hardware_type: server.hardwareType,
    company: server.company,
    server_type: server.serverType,
    location: server.location,
    system_admin: server.systemAdmin,
    backup_admin: server.backupAdmin,
    hardware_admin: server.hardwareAdmin,
    description: server.description,
    domain: server.domain,
    maintenance_window: server.maintenanceWindow,
    ip_address: server.ipAddress,
    application_zone: server.applicationZone,
    operational_zone: server.operationalZone,
    backup: server.backup,
    tags: server.tags,
    created_at: server.createdAt,
    updated_at: server.updatedAt,
    updated_by: server.updatedBy,
    cores: server.cores,
    ram_gb: server.ramGB,
    storage_gb: server.storageGB,
    vsphere_cluster: server.vsphereCluster,
    application: server.application,
    patch_status: server.patchStatus,
    last_patch_date: server.lastPatchDate,
    cpu_load_trend: server.cpuLoadTrend,
    alarm_count: server.alarmCount
  };
};

// Function to convert Supabase format to frontend Server object
const fromSupabaseServer = (server: any): Server => {
  return {
    id: server.id,
    serverName: server.server_name,
    operatingSystem: server.operating_system,
    hardwareType: server.hardware_type,
    company: server.company,
    serverType: server.server_type,
    location: server.location,
    systemAdmin: server.system_admin,
    backupAdmin: server.backup_admin,
    hardwareAdmin: server.hardware_admin,
    description: server.description,
    domain: server.domain,
    maintenanceWindow: server.maintenance_window,
    ipAddress: server.ip_address,
    applicationZone: server.application_zone,
    operationalZone: server.operational_zone,
    backup: server.backup,
    tags: server.tags || [],
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    updatedBy: server.updated_by,
    cores: server.cores,
    ramGB: server.ram_gb,
    storageGB: server.storage_gb,
    vsphereCluster: server.vsphere_cluster,
    application: server.application,
    patchStatus: server.patch_status,
    lastPatchDate: server.last_patch_date,
    cpuLoadTrend: server.cpu_load_trend || [],
    alarmCount: server.alarm_count
  };
};

// Function to convert frontend ServerHistory object to Supabase format
const toSupabaseHistory = (history: ServerHistory) => {
  return {
    id: history.id,
    server_id: history.serverId,
    field: history.field,
    old_value: history.oldValue,
    new_value: history.newValue,
    timestamp: history.timestamp,
    user_text: history.user
  };
};

// Function to convert Supabase format to frontend ServerHistory object
const fromSupabaseHistory = (history: any): ServerHistory => {
  return {
    id: history.id,
    serverId: history.server_id,
    field: history.field,
    oldValue: history.old_value,
    newValue: history.new_value,
    timestamp: history.timestamp,
    user: history.user_text
  };
};

// Fetch all servers from Supabase
export const fetchServers = async (): Promise<Server[]> => {
  const { data, error } = await supabase.from("servers").select("*");
  
  if (error) {
    console.error("Error fetching servers:", error);
    throw error;
  }
  
  return (data || []).map(fromSupabaseServer);
};

// Fetch server history from Supabase
export const fetchServerHistory = async (serverId: string): Promise<ServerHistory[]> => {
  const { data, error } = await supabase
    .from("server_history")
    .select("*")
    .eq("server_id", serverId);
    
  if (error) {
    console.error(`Error fetching history for server ${serverId}:`, error);
    throw error;
  }
  
  return (data || []).map(fromSupabaseHistory);
};

// Create a new server in Supabase
export const createServer = async (server: Omit<Server, "id">): Promise<Server> => {
  const newServer = {
    ...server,
    id: uuidv4()
  };
  
  const { data, error } = await supabase
    .from("servers")
    .insert(toSupabaseServer(newServer as Server))
    .select()
    .single();
    
  if (error) {
    console.error("Error creating server:", error);
    throw error;
  }
  
  return fromSupabaseServer(data);
};

// Update a server in Supabase
export const updateServer = async (id: string, updates: Partial<Server>): Promise<Server> => {
  const { data, error } = await supabase
    .from("servers")
    .update(toSupabaseServer({
      id,
      ...updates
    } as Server))
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating server ${id}:`, error);
    throw error;
  }
  
  return fromSupabaseServer(data);
};

// Delete a server from Supabase
export const deleteServer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("servers")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error(`Error deleting server ${id}:`, error);
    throw error;
  }
};

// Add history record to Supabase
export const addServerHistory = async (history: Omit<ServerHistory, "id">): Promise<ServerHistory> => {
  const newHistory = {
    ...history,
    id: uuidv4()
  };
  
  const { data, error } = await supabase
    .from("server_history")
    .insert(toSupabaseHistory(newHistory as ServerHistory))
    .select()
    .single();
    
  if (error) {
    console.error("Error adding server history:", error);
    throw error;
  }
  
  return fromSupabaseHistory(data);
};

// Sync all local servers to Supabase
export const syncServersToSupabase = async (servers: Server[]): Promise<number> => {
  if (!servers || servers.length === 0) {
    return 0;
  }
  
  const supabaseServers = servers.map(toSupabaseServer);
  
  const { data, error } = await supabase
    .from("servers")
    .upsert(supabaseServers, { onConflict: 'id' });
    
  if (error) {
    console.error("Error syncing servers to Supabase:", error);
    throw error;
  }
  
  return servers.length;
};

// Sync all local history records to Supabase
export const syncHistoryToSupabase = async (
  history: Record<string, ServerHistory[]>
): Promise<number> => {
  let count = 0;
  const historyArray: ServerHistory[] = [];
  
  // Flatten the history record into an array
  Object.values(history).forEach(serverHistory => {
    historyArray.push(...serverHistory);
  });
  
  if (historyArray.length === 0) {
    return 0;
  }
  
  const supabaseHistory = historyArray.map(toSupabaseHistory);
  
  // Process in batches of 1000 to avoid hitting limits
  const batchSize = 1000;
  for (let i = 0; i < supabaseHistory.length; i += batchSize) {
    const batch = supabaseHistory.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from("server_history")
      .upsert(batch, { onConflict: 'id' });
      
    if (error) {
      console.error(`Error syncing history batch ${i / batchSize}:`, error);
      throw error;
    }
    
    count += batch.length;
  }
  
  return count;
};
