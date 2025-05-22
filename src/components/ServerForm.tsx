
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useServerStore from "@/store/serverStore";
import { Server, HardwareType, ServerType, BackupStatus } from "@/types/server";
import { toast } from "sonner";

const serverSchema = z.object({
  serverName: z.string().min(3, "Server name must be at least 3 characters"),
  operatingSystem: z.string().min(1, "Operating system is required"),
  hardwareType: z.enum(["VMware", "Bare-Metal"]),
  company: z.string().min(1, "Company is required"),
  serverType: z.enum(["Production", "Test", "Development", "Staging", "QA"]),
  location: z.string().min(1, "Location is required"),
  systemAdmin: z.string().min(1, "System administrator is required"),
  backupAdmin: z.string().min(1, "Backup administrator is required"),
  hardwareAdmin: z.string().min(1, "Hardware administrator is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
  maintenanceWindow: z.string().min(1, "Maintenance window is required"),
  ipAddress: z.string().regex(/^(?:\d{1,3}\.){3}\d{1,3}$/, "Valid IP address required"),
  applicationZone: z.string().min(1, "Application zone is required"),
  operationalZone: z.string().min(1, "Operational zone is required"),
  backup: z.enum(["Yes", "No"]),
});

const ServerForm = () => {
  const { 
    isFormOpen, 
    closeForm, 
    selectedServer, 
    formMode, 
    addServer, 
    updateServer 
  } = useServerStore();
  
  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      serverName: "",
      operatingSystem: "",
      hardwareType: "VMware",
      company: "",
      serverType: "Production",
      location: "",
      systemAdmin: "",
      backupAdmin: "",
      hardwareAdmin: "",
      description: "",
      domain: "",
      maintenanceWindow: "",
      ipAddress: "",
      applicationZone: "",
      operationalZone: "",
      backup: "Yes",
    },
  });
  
  // Reset form when mode changes or when selected server changes
  useEffect(() => {
    if (formMode === 'edit' && selectedServer) {
      form.reset({
        serverName: selectedServer.serverName,
        operatingSystem: selectedServer.operatingSystem,
        hardwareType: selectedServer.hardwareType,
        company: selectedServer.company,
        serverType: selectedServer.serverType,
        location: selectedServer.location,
        systemAdmin: selectedServer.systemAdmin,
        backupAdmin: selectedServer.backupAdmin,
        hardwareAdmin: selectedServer.hardwareAdmin,
        description: selectedServer.description,
        domain: selectedServer.domain,
        maintenanceWindow: selectedServer.maintenanceWindow,
        ipAddress: selectedServer.ipAddress,
        applicationZone: selectedServer.applicationZone,
        operationalZone: selectedServer.operationalZone,
        backup: selectedServer.backup,
      });
    } else {
      form.reset({
        serverName: "",
        operatingSystem: "",
        hardwareType: "VMware",
        company: "",
        serverType: "Production",
        location: "",
        systemAdmin: "",
        backupAdmin: "",
        hardwareAdmin: "",
        description: "",
        domain: "",
        maintenanceWindow: "",
        ipAddress: "",
        applicationZone: "",
        operationalZone: "",
        backup: "Yes",
      });
    }
  }, [formMode, selectedServer, form]);
  
  // Sample options for various fields
  const operatingSystems = [
    'Windows Server 2019', 'Windows Server 2016', 'Windows Server 2022',
    'Ubuntu 20.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 11',
    'Red Hat Enterprise Linux 8', 'Red Hat Enterprise Linux 9',
    'CentOS 7', 'CentOS 8', 'SUSE Linux Enterprise 15',
    'macOS Server'
  ];
  
  const locations = [
    'Frankfurt', 'Berlin', 'Munich', 'Hamburg', 'Cologne',
    'Vienna', 'Zurich', 'Amsterdam', 'Brussels', 'Paris',
    'London', 'Dublin', 'Stockholm', 'Oslo', 'Copenhagen'
  ];
  
  const applicationZones = [
    'Internet', 'Intranet', 'DMZ', 'Secure', 'Public'
  ];
  
  const operationalZones = [
    'Production', 'Staging', 'Testing', 'Development', 'QA'
  ];
  
  const admins = [
    'Alice Smith', 'Bob Johnson', 'Carol Williams', 'Dave Brown',
    'Eve Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
    'Ivy Taylor', 'Jack Anderson', 'Karen Thomas', 'Leo Harris'
  ];
  
  const maintenanceWindows = [
    'Sunday 02:00-04:00', 'Saturday 22:00-01:00', 'Wednesday 23:00-01:00',
    'Monday 01:00-03:00', 'Thursday 22:00-23:00', 'Tuesday 02:00-04:00'
  ];
  
  const domains = [
    'internal.local', 'corp.local', 'ad.company.com', 'prod.company.com',
    'test.company.com', 'dev.company.com', 'dmz.company.com'
  ];
  
  const companies = [
    'Acme Corp', 'Globex', 'Initech', 'Umbrella Corp',
    'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems',
    'Aperture Science', 'Rekall', 'Weyland-Yutani', 'Tyrell Corp',
    'Massive Dynamic'
  ];
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof serverSchema>) => {
    if (formMode === 'create') {
      const newServer: Server = {
        ...values,
        id: Math.random().toString(36).substring(2, 11),
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'Current User',
      };
      
      addServer(newServer);
      toast.success('Server created successfully');
    } else if (formMode === 'edit' && selectedServer) {
      updateServer(selectedServer.id, values);
      toast.success('Server updated successfully');
    }
    
    closeForm();
  };
  
  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formMode === 'create' ? 'Create New Server' : 'Edit Server'}
          </DialogTitle>
          <DialogDescription>
            {formMode === 'create' 
              ? 'Add a new server to the inventory.' 
              : `Update information for server ${selectedServer?.serverName || ''}.`}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="SRV-XXX-001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the server
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
                    <FormLabel>Operating System*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select OS" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operatingSystems.map(os => (
                          <SelectItem key={os} value={os}>{os}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hardwareType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hardware Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VMware">VMware</SelectItem>
                        <SelectItem value="Bare-Metal">Bare-Metal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serverType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Staging">Staging</SelectItem>
                        <SelectItem value="QA">QA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="systemAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Administrator*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {admins.map(admin => (
                          <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="backupAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup Administrator*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {admins.map(admin => (
                          <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hardwareAdmin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hardware Administrator*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hardware admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {admins.map(admin => (
                          <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {domains.map(domain => (
                          <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maintenanceWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Window*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select maintenance window" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maintenanceWindows.map(window => (
                          <SelectItem key={window} value={window}>{window}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="applicationZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Zone*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {applicationZones.map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="operationalZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operational Zone*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operational zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operationalZones.map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="backup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup Enabled*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Server description and purpose"
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">
                {formMode === 'create' ? 'Create Server' : 'Update Server'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerForm;
