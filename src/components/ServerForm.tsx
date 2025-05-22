import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';
import { Server, BackupStatus } from '../types/server';

interface ServerFormProps {
  server?: Server;
  initialValues?: Partial<Server>;
  onSubmit: (values: Server) => void;
  onCancel: () => void;
}

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

const hardwareTypes = ['VMware', 'Bare-Metal'];
const serverTypes = ['Production', 'Test', 'Development', 'Staging', 'QA'];
const companies = ['RAITEC', 'RLB', 'RSG', 'PFH', 'Hosting'];
const locations = ['Linz 1', 'Linz 2', 'Graz', 'Salzburg', 'Innsbruck'];
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
const domains = [
  'corp.example.com',
  'dev.example.com',
  'test.example.com',
  'prod.example.com',
  'internal.example.com'
];
const maintenanceWindows = [
  'Sunday 02:00-06:00',
  'Saturday 22:00-02:00',
  'Wednesday 23:00-03:00',
  'Monday 01:00-05:00',
  'Friday 22:00-02:00',
  'Unbekannt'
];
const appZones = [
  'DMZ',
  'Internal',
  'Secure',
  'Development',
  'Testing'
];
const opZones = [
  'Production',
  'Non-Production',
  'Development',
  'Testing',
  'Staging'
];
const applications = [
  'ERP System', 'CRM Platform', 'Webserver', 'Datenbank', 'Mail Server',
  'Fileserver', 'Backup System', 'Monitoring', 'Active Directory',
  'CI/CD Pipeline', 'Kubernetes Cluster', 'Data Warehouse'
];

const ServerForm: React.FC<ServerFormProps> = ({ server, initialValues, onSubmit, onCancel }) => {
  const [isNewServer, setIsNewServer] = useState(!server);

  useEffect(() => {
    setIsNewServer(!server);
  }, [server]);

  const form = useForm<Server>({
    defaultValues: server || initialValues || {
      id: '',
      serverName: '',
      operatingSystem: '',
      hardwareType: 'VMware',
      company: '',
      serverType: 'Development',
      location: '',
      systemAdmin: '',
      backupAdmin: '',
      hardwareAdmin: '',
      description: '',
      domain: '',
      maintenanceWindow: '',
      ipAddress: '',
      applicationZone: '',
      operationalZone: '',
      backup: 'Ja',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      cores: 0,
      ramGB: 0,
      storageGB: 0,
      vsphereCluster: '',
      application: '',
      patchStatus: 'aktuell',
      lastPatchDate: new Date().toISOString(),
      cpuLoadTrend: [],
      alarmCount: 0
    },
    mode: "onChange"
  });

  const onSubmitForm = (values: Server) => {
    if (isNewServer) {
      const serverId = uuidv4();
      const newServer: Server = {
        id: serverId,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
        serverName: values.serverName || '',
        operatingSystem: values.operatingSystem || '',
        hardwareType: values.hardwareType || 'VMware',
        company: values.company || '',
        serverType: values.serverType || 'Development',
        location: values.location || '',
        systemAdmin: values.systemAdmin || '',
        backupAdmin: values.backupAdmin || '',
        hardwareAdmin: values.hardwareAdmin || '',
        description: values.description || '',
        domain: values.domain || '',
        maintenanceWindow: values.maintenanceWindow || '',
        ipAddress: values.ipAddress || '',
        applicationZone: values.applicationZone || '',
        operationalZone: values.operationalZone || '',
        backup: values.backup as BackupStatus || 'Nein',
        cores: Math.floor(Math.random() * 8) + 2,
        ramGB: (Math.floor(Math.random() * 6) + 2) * 4,
        storageGB: Math.floor(Math.random() * 500) + 100,
        vsphereCluster: values.hardwareType === 'VMware' ? 'Cluster-03-DEV' : '',
        application: values.application || 'Unbekannt',
        patchStatus: 'aktuell',
        lastPatchDate: new Date().toISOString(),
        cpuLoadTrend: Array(24).fill(0).map(() => Math.floor(Math.random() * 30) + 5),
        alarmCount: 0
      };
      onSubmit(newServer);
      toast({
        title: "Server created.",
        description: "Your server has been created.",
      })
    } else {
      if (!server) return;

      const updatedFields: Partial<Server> = {
        serverName: values.serverName,
        operatingSystem: values.operatingSystem,
        hardwareType: values.hardwareType,
        company: values.company,
        serverType: values.serverType,
        location: values.location,
        systemAdmin: values.systemAdmin,
        backupAdmin: values.backupAdmin,
        hardwareAdmin: values.hardwareAdmin,
        description: values.description,
        domain: values.domain,
        maintenanceWindow: values.maintenanceWindow,
        ipAddress: values.ipAddress,
        applicationZone: values.applicationZone,
        operationalZone: values.operationalZone,
        backup: values.backup as BackupStatus,
        application: values.application
      };

      const updatedServer: Server = { ...server, ...updatedFields };
      onSubmit(updatedServer);
      toast({
        title: "Server updated.",
        description: "Your server has been updated.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="serverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input placeholder="SRV-APP-001" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operatingSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operatingSystems.map((os) => (
                    <SelectItem key={os} value={os}>{os}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the operating system of the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hardwareType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hardware Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hardware Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hardwareTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the hardware type.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the company that owns the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serverType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Server Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serverTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Specify the type of server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the server location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="systemAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Admin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select System Admin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign a system administrator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backupAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backup Admin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Backup Admin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign a backup administrator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hardwareAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hardware Admin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hardware Admin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign a hardware administrator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description of the server" {...field} />
              </FormControl>
              <FormDescription>
                Describe the server's purpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Domain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Specify the domain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maintenanceWindow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Window</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Maintenance Window" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maintenanceWindows.map((window) => (
                    <SelectItem key={window} value={window}>{window}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the maintenance window.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input placeholder="192.168.1.1" {...field} />
              </FormControl>
              <FormDescription>
                Enter the IP address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicationZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Application Zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Specify the application zone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operationalZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operational Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Operational Zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {opZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the operational zone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backup</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Backup Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ja">Ja</SelectItem>
                  <SelectItem value="Nein">Nein</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Indicate if backup is enabled.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="application"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Application" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {applications.map((application) => (
                    <SelectItem key={application} value={application}>{application}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the application.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{isNewServer ? 'Create' : 'Update'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ServerForm;
