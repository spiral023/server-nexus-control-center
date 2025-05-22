import { 
  Server, 
  HardwareType, 
  ServerType, 
  BackupStatus, 
  ServerHistory 
} from '../types/server';
import { v4 as uuidv4 } from 'uuid';

// Sample server types
const serverTypes = ['Production', 'Test', 'Development', 'Staging', 'QA'];

// Sample hardware types
const hardwareTypes = ['VMware', 'Bare-Metal'];

// Sample operating systems
const operatingSystems = [
  'Windows Server 2022',
  'Windows Server 2019',
  'Windows Server 2016',
  'Ubuntu 22.04 LTS',
  'Ubuntu 20.04 LTS',
  'Red Hat Enterprise Linux 9',
  'Red Hat Enterprise Linux 8',
  'CentOS 7',
  'Debian 11',
  'Debian 10'
];

// Sample applications for grouping
const applications = [
  'ERP System', 'CRM Platform', 'Webserver', 'Datenbank', 'Mail Server', 
  'Fileserver', 'Backup System', 'Monitoring', 'Active Directory', 
  'CI/CD Pipeline', 'Kubernetes Cluster', 'Data Warehouse'
];

// vSphere clusters
const vsphereClusters = [
  'Cluster-01-PROD', 'Cluster-02-QA', 'Cluster-03-DEV', 'Cluster-04-TEST'
];

// Patch status options with weights
const patchStatuses = [
  { status: 'aktuell', weight: 50 },
  { status: 'veraltet', weight: 30 },
  { status: 'kritisch', weight: 20 }
];

// Companies
const companies = ['RAITEC', 'RLB', 'RSG', 'PFH', 'Hosting'];

// Locations
const locations = ['Linz 1', 'Linz 2', 'Graz', 'Salzburg', 'Innsbruck'];

// Sample admins
const admins = [
  'Max Mustermann',
  'Anna Schmidt',
  'Thomas Huber',
  'Maria Müller',
  'Michael Weber',
  'Laura Schneider',
  'Stefan Fischer',
  'Julia Wagner',
  'Andreas Becker',
  'Sarah Hoffmann'
];

// Sample users
const users = [
  'admin',
  'jdoe',
  'asmith',
  'mwilson',
  'rjohnson',
  'system'
];

// Sample descriptions
const descriptions = [
  'Primary application server',
  'Database server for CRM',
  'Web server for corporate website',
  'Development environment',
  'Test server for QA team',
  'Backup server',
  'File server for department',
  'Authentication server',
  'Monitoring server',
  'CI/CD pipeline server'
];

// Sample domains
const domains = [
  'corp.example.com',
  'dev.example.com',
  'test.example.com',
  'prod.example.com',
  'internal.example.com'
];

// Sample maintenance windows
const maintenanceWindows = [
  'Sunday 02:00-06:00',
  'Saturday 22:00-02:00',
  'Wednesday 23:00-03:00',
  'Monday 01:00-05:00',
  'Friday 22:00-02:00',
  'Unbekannt'
];

// Sample application zones
const appZones = [
  'DMZ',
  'Internal',
  'Secure',
  'Development',
  'Testing'
];

// Sample operational zones
const opZones = [
  'Production',
  'Non-Production',
  'Development',
  'Testing',
  'Staging'
];

// Sample tags
const tags = [
  'critical',
  'high-availability',
  'backup-required',
  'temporary',
  'project-alpha',
  'project-beta',
  'migration-target',
  'migration-source',
  'to-be-decommissioned',
  'new-deployment',
  'sensitive-data',
  'public-facing',
  'internal-only',
  'compliance-required',
  'disaster-recovery'
];

// Helper function to get a random item from an array
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Helper function to get a random date between two dates
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate a random IP address
function generateRandomIP(): string {
  return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Helper function to get random tags
function getRandomTags(): string[] {
  const numTags = Math.floor(Math.random() * 4); // 0-3 tags
  const selectedTags: string[] = [];
  
  for (let i = 0; i < numTags; i++) {
    const tag = getRandomItem(tags);
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  return selectedTags;
}

// Generate random CPU load trend (24 points for 24 hours)
function generateCpuLoadTrend() {
  const trend = [];
  let lastValue = Math.random() * 30 + 10; // Start between 10-40%
  
  for (let i = 0; i < 24; i++) {
    // Add some variation but keep it somewhat consistent
    const change = (Math.random() * 20) - 10; // -10 to +10 change
    lastValue = Math.max(5, Math.min(95, lastValue + change)); // Keep between 5-95%
    trend.push(Math.round(lastValue));
  }
  
  return trend;
}

// Helper function for weighted random selection
function getWeightedRandomItem<T extends { status: string, weight: number }>(items: T[]): string {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.status;
    }
  }
  
  return items[0].status; // Fallback
}

// Generate server history entries
export function generateServerHistory(server: Server, count: number): ServerHistory[] {
  const history: ServerHistory[] = [];
  
  // Start from a date after server creation but before last update
  const startDate = new Date(server.createdAt);
  const endDate = new Date(server.updatedAt);
  
  // Generate random history entries
  for (let i = 0; i < count; i++) {
    const timestamp = getRandomDate(startDate, endDate);
    const fields: (keyof Server)[] = [
      'operatingSystem', 'hardwareType', 'serverType', 
      'location', 'systemAdmin', 'description', 'backup'
    ];
    
    const field = getRandomItem(fields);
    let oldValue = '';
    let newValue = '';
    
    // Generate plausible old and new values based on field type
    switch (field) {
      case 'operatingSystem':
        oldValue = getRandomItem(operatingSystems);
        newValue = server.operatingSystem;
        break;
      case 'hardwareType':
        oldValue = getRandomItem(hardwareTypes);
        newValue = server.hardwareType;
        break;
      case 'serverType':
        oldValue = getRandomItem(serverTypes);
        newValue = server.serverType;
        break;
      case 'location':
        oldValue = getRandomItem(locations);
        newValue = server.location;
        break;
      case 'systemAdmin':
        oldValue = getRandomItem(admins);
        newValue = server.systemAdmin;
        break;
      case 'description':
        oldValue = getRandomItem(descriptions);
        newValue = server.description;
        break;
      case 'backup':
        oldValue = server.backup === 'Ja' ? 'Nein' : 'Ja';
        newValue = server.backup;
        break;
      default:
        oldValue = 'Previous value';
        newValue = 'Updated value';
    }
    
    history.push({
      id: `history-${server.id}-${i}`,
      serverId: server.id,
      field,
      oldValue,
      newValue,
      timestamp: timestamp.toISOString(),
      user: getRandomItem(users)
    });
  }
  
  // Sort by timestamp, newest first
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Helper function to generate a random server name
function generateServerName(): string {
  const serverType = getRandomItem(serverTypes) as ServerType;
  const hardwareType = getRandomItem(hardwareTypes) as HardwareType;
  const app = getRandomItem(['APP', 'DB', 'WEB', 'FILE', 'TEST', 'DEV']);
  return `SRV-${app}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`;
}

// Helper function to generate a random person name
function generatePersonName(): string {
  const firstNames = ['Max', 'Anna', 'Thomas', 'Maria', 'Michael', 'Laura', 'Stefan', 'Julia', 'Andreas', 'Sarah'];
  const lastNames = ['Mustermann', 'Schmidt', 'Huber', 'Müller', 'Weber', 'Schneider', 'Fischer', 'Wagner', 'Becker', 'Hoffmann'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Helper function to generate a random description
function generateDescription(): string {
  return getRandomItem(descriptions);
}

// Helper function to generate a random maintenance window
function generateMaintenanceWindow(): string {
  return getRandomItem(maintenanceWindows);
}

// Helper function to generate a random IP address
function generateIPAddress(): string {
  return generateRandomIP();
}

// Helper function to generate a random string of a given length
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Helper function to generate a random tag
function generateTag(): string {
  return getRandomItem(tags);
}

// Helper function to generate a random date between two dates
function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// When generating mock servers, add the new fields
export function generateMockServers(count: number): Server[] {
  const servers: Server[] = [];
  const companies = ['RAITEC', 'RLB', 'RSG', 'PFH', 'Hosting'];
  const locations = ['Linz 1', 'Linz 2', 'Graz', 'Salzburg', 'Innsbruck'];
  const operatingSystems = [
    'Windows Server 2022',
    'Windows Server 2019',
    'Windows Server 2016',
    'Ubuntu 22.04 LTS',
    'Ubuntu 20.04 LTS',
    'Red Hat Enterprise Linux 9',
    'Red Hat Enterprise Linux 8',
    'CentOS 7',
    'Debian 11',
    'Debian 10'
  ];
  const serverTypes: ServerType[] = ['Production', 'Test', 'Development', 'Staging', 'QA'];
  const hardwareTypes: HardwareType[] = ['VMware', 'Bare-Metal'];
  const vsphereCluster = ['Cluster-01-PROD', 'Cluster-02-QA', 'Cluster-03-DEV', 'Cluster-04-TEST'];
  const applications = [
    'ERP System', 'CRM Platform', 'Webserver', 'Datenbank', 'Mail Server',
    'Fileserver', 'Backup System', 'Monitoring', 'Active Directory',
    'CI/CD Pipeline', 'Kubernetes Cluster', 'Data Warehouse'
  ];
  const patchStatuses: ('aktuell' | 'veraltet' | 'kritisch')[] = ['aktuell', 'veraltet', 'kritisch'];
  
  for (let i = 0; i < count; i++) {
    const cores = Math.floor(Math.random() * 8) + 2; // 2-10 cores
    const ram = (Math.floor(Math.random() * 6) + 2) * 4; // 8-32 GB in increments of 4
    const storage = Math.floor(Math.random() * 500) + 100; // 100-600 GB

    servers.push({
      id: uuidv4(),
      serverName: generateServerName(),
      operatingSystem: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
      hardwareType: hardwareTypes[Math.floor(Math.random() * hardwareTypes.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      serverType: serverTypes[Math.floor(Math.random() * serverTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      systemAdmin: generatePersonName(),
      backupAdmin: generatePersonName(),
      hardwareAdmin: generatePersonName(),
      description: generateDescription(),
      domain: `${generateRandomString(8)}.example.com`,
      maintenanceWindow: generateMaintenanceWindow(),
      ipAddress: generateIPAddress(),
      applicationZone: generateRandomString(5),
      operationalZone: generateRandomString(5),
      backup: Math.random() > 0.3 ? 'Ja' : 'Nein' as BackupStatus,
      tags: Array(Math.floor(Math.random() * 3)).fill(0).map(_ => generateTag()),
      createdAt: generateRandomDate(new Date(2020, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: generatePersonName(),
      cores: cores,
      ramGB: ram,
      storageGB: storage,
      vsphereCluster: hardwareTypes[0] === 'VMware' ? vsphereCluster[Math.floor(Math.random() * vsphereCluster.length)] : '',
      application: applications[Math.floor(Math.random() * applications.length)],
      patchStatus: patchStatuses[Math.floor(Math.random() * patchStatuses.length)],
      lastPatchDate: generateRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      cpuLoadTrend: Array(24).fill(0).map(() => Math.floor(Math.random() * 30) + 5),
      alarmCount: Math.floor(Math.random() * 5)
    });
  }
  
  return servers;
}

// Creating a helper function to generate a large batch of servers incrementally
export function generateLargeBatchOfServers(count: number): Server[] {
  // Generate servers in chunks to avoid memory issues
  const chunkSize = 100;
  let servers: Server[] = [];
  
  for (let i = 0; i < count; i += chunkSize) {
    const batchSize = Math.min(chunkSize, count - i);
    servers = [...servers, ...generateMockServers(batchSize)];
  }
  
  return servers;
}
