import { Server, ServerHistory } from '../types/server';

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
  'Cluster-01-PROD', 'Cluster-02-TEST', 'Cluster-03-DEV', 'Cluster-DR', 'Cluster-DMZ'
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
function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
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

// When generating mock servers, add the new fields
export function generateMockServers(count: number): Server[] {
  return Array.from({ length: count }).map((_, i) => {
    const serverType = getRandomItem(serverTypes);
    const hardwareType = getRandomItem(hardwareTypes);
    const createdAt = getRandomDate(new Date('2018-01-01'), new Date());
    const updatedAt = getRandomDate(new Date(createdAt), new Date());
    const patchStatus = getWeightedRandomItem(patchStatuses);
    const lastPatchDate = getRandomDate(new Date(createdAt), new Date());
    const application = getRandomItem(applications);
    
    // Generate random resources based on serverType
    const isProd = serverType === 'Production';
    const isVM = hardwareType === 'VMware';
    
    const cores = isProd 
      ? Math.floor(Math.random() * 16) + 8 // 8-24 cores for prod
      : Math.floor(Math.random() * 8) + 2; // 2-10 cores for non-prod
      
    const ramGB = isProd
      ? (Math.floor(Math.random() * 10) + 8) * 8 // 64-144 GB for prod (in 8GB increments)
      : (Math.floor(Math.random() * 6) + 2) * 4; // 8-28 GB for non-prod (in 4GB increments)
      
    const storageGB = isProd
      ? Math.floor(Math.random() * 1000) + 500 // 500-1500 GB for prod
      : Math.floor(Math.random() * 500) + 100; // 100-600 GB for non-prod
    
    const vsphereCluster = isVM ? getRandomItem(vsphereClusters) : '';
    
    return {
      id: `server-${i + 1}`,
      serverName: `SRV-${getRandomItem(['APP', 'DB', 'WEB', 'FILE', 'TEST', 'DEV'])}-${String(i + 1).padStart(3, '0')}`,
      operatingSystem: getRandomItem(operatingSystems),
      hardwareType,
      company: getRandomItem(companies),
      serverType,
      location: getRandomItem(locations),
      systemAdmin: getRandomItem(admins),
      backupAdmin: getRandomItem(admins),
      hardwareAdmin: getRandomItem(admins),
      description: getRandomItem(descriptions),
      domain: getRandomItem(domains),
      maintenanceWindow: getRandomItem(maintenanceWindows),
      ipAddress: generateRandomIP(),
      applicationZone: getRandomItem(appZones),
      operationalZone: getRandomItem(opZones),
      backup: getRandomItem(['Ja', 'Ja', 'Ja', 'Nein']), // 75% have backup
      tags: getRandomTags(),
      createdAt,
      updatedAt,
      updatedBy: getRandomItem(users),
      // New fields
      cores,
      ramGB,
      storageGB,
      vsphereCluster,
      application,
      patchStatus,
      lastPatchDate: lastPatchDate.toISOString(),
      cpuLoadTrend: generateCpuLoadTrend(),
      alarmCount: Math.floor(Math.random() * 5) // 0-4 alarms
    };
  });
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
      timestamp,
      user: getRandomItem(users)
    });
  }
  
  // Sort by timestamp, newest first
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
