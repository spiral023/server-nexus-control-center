
export type HardwareType = 'VMware' | 'Bare-Metal';
export type ServerType = 'Production' | 'Test' | 'Development' | 'Staging' | 'QA';
export type BackupStatus = 'Yes' | 'No';

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
