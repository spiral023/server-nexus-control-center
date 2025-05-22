
import { Server, ServerHistory, HardwareType, ServerType, BackupStatus } from '../types/server';

// Mock data generation
const operatingSystems = [
  'Windows Server 2019', 'Windows Server 2016', 'Windows Server 2022',
  'Ubuntu 20.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 11',
  'Red Hat Enterprise Linux 8', 'Red Hat Enterprise Linux 9',
  'CentOS 7', 'CentOS 8', 'SUSE Linux Enterprise 15',
  'macOS Server'
];

const companies = [
  'Acme Corp', 'Globex', 'Initech', 'Umbrella Corp',
  'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems',
  'Aperture Science', 'Rekall', 'Weyland-Yutani', 'Tyrell Corp',
  'Massive Dynamic', 'Soylent Corp', 'Monsters Inc'
];

const locations = [
  'Frankfurt', 'Berlin', 'Munich', 'Hamburg', 'Cologne',
  'Vienna', 'Zurich', 'Amsterdam', 'Brussels', 'Paris',
  'London', 'Dublin', 'Stockholm', 'Oslo', 'Copenhagen'
];

const domains = [
  'internal.local', 'corp.local', 'ad.company.com', 'prod.company.com',
  'test.company.com', 'dev.company.com', 'dmz.company.com'
];

const applicationZones = [
  'Internet', 'Intranet', 'DMZ', 'Secure', 'Public'
];

const operationalZones = [
  'Production', 'Staging', 'Testing', 'Development', 'QA'
];

const users = [
  'Alice Smith', 'Bob Johnson', 'Carol Williams', 'Dave Brown',
  'Eve Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
  'Ivy Taylor', 'Jack Anderson', 'Karen Thomas', 'Leo Harris'
];

const maintenanceWindows = [
  'Sunday 02:00-04:00', 'Saturday 22:00-01:00', 'Wednesday 23:00-01:00',
  'Monday 01:00-03:00', 'Thursday 22:00-23:00', 'Tuesday 02:00-04:00'
];

const serverTypes: ServerType[] = [
  'Production', 'Test', 'Development', 'Staging', 'QA'
];

const hardwareTypes: HardwareType[] = ['VMware', 'Bare-Metal'];

const backupStatus: BackupStatus[] = ['Yes', 'No'];

const tags = [
  'Critical', 'High-Availability', 'Legacy', 'Maintenance',
  'Project-X', 'Security-Critical', 'Temporary', 'Migration-Target',
  'Migration-Source', 'Upgrade-Pending', 'End-of-Life'
];

// Helper to generate random IP address
const generateIpAddress = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Helper to get a random element from an array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper to get multiple random elements from an array
const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper to generate random date within the last 2 years
const getRandomDate = (pastDays = 730) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * pastDays));
  return date.toISOString();
};

// Helper to create a description based on server info
const generateDescription = (serverName: string, serverType: ServerType, os: string) => {
  const descriptions = [
    `${serverType} server running ${os}`,
    `${serverType.toLowerCase()} environment for application services on ${os}`,
    `${os} server for ${serverType.toLowerCase()} workloads`,
    `${serverName} ${serverType.toLowerCase()} instance`,
    `Primary ${serverType.toLowerCase()} server for ${os}-based applications`
  ];
  
  return getRandomElement(descriptions);
};

// Generate a list of mock servers
export const generateMockServers = (count: number): Server[] => {
  const servers: Server[] = [];
  
  for (let i = 0; i < count; i++) {
    const serverType = getRandomElement(serverTypes);
    const operatingSystem = getRandomElement(operatingSystems);
    const company = getRandomElement(companies);
    const location = getRandomElement(locations);
    const domain = getRandomElement(domains);
    const created = getRandomDate();
    const updated = new Date(new Date(created).getTime() + Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString();
    
    const serverName = `SRV-${company.substring(0, 3).toUpperCase()}-${serverType.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`;
    
    servers.push({
      id: Math.random().toString(36).substring(2, 11),
      serverName,
      operatingSystem,
      hardwareType: getRandomElement(hardwareTypes),
      company,
      serverType,
      location,
      systemAdmin: getRandomElement(users),
      backupAdmin: getRandomElement(users),
      hardwareAdmin: getRandomElement(users),
      description: generateDescription(serverName, serverType, operatingSystem),
      domain,
      maintenanceWindow: getRandomElement(maintenanceWindows),
      ipAddress: generateIpAddress(),
      applicationZone: getRandomElement(applicationZones),
      operationalZone: getRandomElement(operationalZones),
      backup: getRandomElement(backupStatus),
      tags: getRandomElements(tags, Math.floor(Math.random() * 4)),
      createdAt: created,
      updatedAt: updated,
      updatedBy: getRandomElement(users)
    });
  }
  
  return servers;
};

// Generate mock server history entries
export const generateServerHistory = (server: Server, entriesCount: number): ServerHistory[] => {
  const history: ServerHistory[] = [];
  
  // Generate random history entries
  const pastTimestamp = new Date(server.createdAt);
  const presentTimestamp = new Date(server.updatedAt);
  
  const timeRange = presentTimestamp.getTime() - pastTimestamp.getTime();
  const possibleFields: (keyof Server)[] = [
    'operatingSystem', 'systemAdmin', 'backupAdmin', 
    'location', 'description', 'maintenanceWindow', 'backup'
  ];
  
  for (let i = 0; i < entriesCount; i++) {
    const randomTime = new Date(pastTimestamp.getTime() + Math.random() * timeRange);
    const field = getRandomElement(possibleFields);
    
    let oldValue: string;
    let newValue: string = String(server[field]);
    
    // Generate a plausible old value
    switch (field) {
      case 'operatingSystem':
        oldValue = getRandomElement(operatingSystems);
        while (oldValue === newValue) {
          oldValue = getRandomElement(operatingSystems);
        }
        break;
      case 'systemAdmin':
      case 'backupAdmin':
        oldValue = getRandomElement(users);
        while (oldValue === newValue) {
          oldValue = getRandomElement(users);
        }
        break;
      case 'location':
        oldValue = getRandomElement(locations);
        while (oldValue === newValue) {
          oldValue = getRandomElement(locations);
        }
        break;
      case 'maintenanceWindow':
        oldValue = getRandomElement(maintenanceWindows);
        while (oldValue === newValue) {
          oldValue = getRandomElement(maintenanceWindows);
        }
        break;
      case 'backup':
        oldValue = server.backup === 'Yes' ? 'No' : 'Yes';
        break;
      default:
        oldValue = `Old ${String(newValue)}`;
    }
    
    history.push({
      id: Math.random().toString(36).substring(2, 11),
      serverId: server.id,
      field,
      oldValue,
      newValue,
      timestamp: randomTime.toISOString(),
      user: getRandomElement(users)
    });
  }
  
  // Sort by timestamp
  history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  return history;
};
