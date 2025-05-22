
export type HardwareType = 'VMware' | 'Bare-Metal';
export type ServerType = 'Production' | 'Test' | 'Development' | 'Staging' | 'QA';
export type BackupStatus = 'Ja' | 'Nein';

export interface Server {
  id: string;
  serverName: string;
  operatingSystem: string;
  hardwareType: HardwareType;
  company: string;
  serverType: ServerType;
  location: string;
  systemAdmin: string;
  backupAdmin: string;
  hardwareAdmin: string;
  description: string;
  domain: string;
  maintenanceWindow: string;
  ipAddress: string;
  applicationZone: string;
  operationalZone: string;
  backup: BackupStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  // New fields
  cores: number;
  ramGB: number;
  storageGB: number;
  vsphereCluster: string;
  application: string;
  patchStatus: 'aktuell' | 'veraltet' | 'kritisch'; // For tracking patch status
  lastPatchDate: string;
  cpuLoadTrend: number[]; // For storing CPU load trend data
  alarmCount: number; // For alarm count tracking
}

export interface ServerHistory {
  id: string;
  serverId: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  user: string;
}

export interface ServerFilter {
  key: keyof Server | 'all';
  value: string;
}

export interface ServerSort {
  key: keyof Server;
  direction: 'asc' | 'desc';
}

export interface ServerView {
  id: string;
  name: string;
  userId: string;
  filters: ServerFilter[];
  visibleColumns: (keyof Server)[];
  sortOrder: ServerSort[];
}

// New interface for application grouping
export interface Application {
  id: string;
  name: string;
  description: string;
  servers: string[]; // Array of server IDs
}
