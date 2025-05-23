
import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useDisclosure } from "@/components/ui/use-disclosure"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Server } from "@/types/server"
import { generateMockServers } from "@/lib/mockData"
import { exportToCSV, exportToExcel } from "@/lib/utils"
import SparklineChart from "@/components/SparklineChart"
import ServerStats from "@/components/ServerStats"
import ServerForm from "@/components/ServerForm"
import { Checkbox } from "@/components/ui/checkbox"

// Define a schema for the server form
const formSchema = z.object({
  serverName: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
})

const Dashboard = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serversPerPage] = useState(10);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  })
  const { toast } = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const mockServers = generateMockServers(25);
    setServers(mockServers);
  }, []);

  // Get current servers
  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = servers.slice(indexOfFirstServer, indexOfLastServer);

  // Fix the pagination component usage
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(servers.length / serversPerPage);

  const columns: ColumnDef<Server>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "serverName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Server Name
            <ArrowDown className="h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("serverName")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "operatingSystem",
      header: "Operating System",
    },
    {
      accessorKey: "hardwareType",
      header: "Hardware Type",
      cell: ({ row }) => {
        const hardwareType = row.getValue("hardwareType")
        return (
          <div className="flex items-center">
            {String(hardwareType)}
          </div>
        )
      },
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "serverType",
      header: "Server Type",
      cell: ({ row }) => {
        const serverType = row.getValue("serverType")
        return (
          <div className="flex items-center">
            <Badge className={cn(
              "mr-2 rounded-md px-2 py-0.5 uppercase",
            )}>{String(serverType)}</Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "systemAdmin",
      header: "System Admin",
    },
    {
      accessorKey: "backupAdmin",
      header: "Backup Admin",
    },
    {
      accessorKey: "hardwareAdmin",
      header: "Hardware Admin",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "domain",
      header: "Domain",
    },
    {
      accessorKey: "maintenanceWindow",
      header: "Maintenance Window",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "applicationZone",
      header: "Application Zone",
    },
    {
      accessorKey: "operationalZone",
      header: "Operational Zone",
    },
    {
      accessorKey: "backup",
      header: "Backup",
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {tags && tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return <div>{formatDate(createdAt, true)}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        return <div>{formatDate(updatedAt, true)}</div>;
      },
    },
    {
      accessorKey: "updatedBy",
      header: "Updated By",
    },
    {
      accessorKey: "cores",
      header: "Cores",
    },
    {
      accessorKey: "ramGB",
      header: "RAM (GB)",
    },
    {
      accessorKey: "storageGB",
      header: "Storage (GB)",
    },
    {
      accessorKey: "vsphereCluster",
      header: "vSphere Cluster",
    },
    {
      accessorKey: "application",
      header: "Application",
    },
    {
      accessorKey: "patchStatus",
      header: "Patch Status",
    },
    {
      accessorKey: "lastPatchDate",
      header: "Last Patch Date",
      cell: ({ row }) => {
        const lastPatchDate = row.getValue("lastPatchDate") as string;
        return <div>{formatDate(lastPatchDate, true)}</div>;
      },
    },
    {
      accessorKey: "cpuLoadTrend",
      header: "CPU Load Trend",
      cell: ({ row }) => {
        const cpuLoadTrend = row.getValue("cpuLoadTrend") as number[];
        return <SparklineChart data={cpuLoadTrend} />;
      },
    },
    {
      accessorKey: "alarmCount",
      header: "Alarm Count",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const server = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(server.id)}
              >
                Copy server ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View server</DropdownMenuItem>
              <DropdownMenuItem>Edit server</DropdownMenuItem>
              <DropdownMenuItem>Delete server</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: servers,
    columns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setVisibility,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      columnVisibility: visibility,
    },
  })

  // Handle global filtering separately
  const filteredServers = globalFilter 
    ? servers.filter(server => 
        server.serverName.toLowerCase().includes(globalFilter.toLowerCase())
      )
    : servers;

  const exportData = () => {
    // Fix accessing column properties
    const visibleColumns = columns
      .filter(column => {
        const columnId = column.id || (column as any).accessorKey as string;
        return columnId && visibility[columnId] !== false;
      })
      .map(column => column.id || (column as any).accessorKey as string)
      .filter(Boolean) as (keyof Server)[];

    exportToCSV(servers, visibleColumns);
    
    toast({
      title: "Exporting data...",
      description: "Your CSV file will be downloaded shortly.",
    })
  }

  const exportExcelData = () => {
    // Fix accessing column properties
    const visibleColumns = columns
      .filter(column => {
        const columnId = column.id || (column as any).accessorKey as string;
        return columnId && visibility[columnId] !== false;
      })
      .map(column => column.id || (column as any).accessorKey as string)
      .filter(Boolean) as (keyof Server)[];

    exportToExcel(servers, visibleColumns);
    
    toast({
      title: "Exporting data...",
      description: "Your Excel file will be downloaded shortly.",
    })
  }

  // Handle ServerForm submission
  const handleFormSubmit = (values: Server) => {
    setServers([...servers, values]);
    onClose();
  };

  const handleFormCancel = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Server hinzufügen</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Server hinzufügen</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Server durch Ausfüllen des untenstehenden Formulars.
            </DialogDescription>
          </DialogHeader>
          <ServerForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Server Overview</CardTitle>
            <CardDescription>
              Hier ist eine Übersicht aller Ihrer Server. Sie können die Daten filtern, sortieren und exportieren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Filter</CardTitle>
                  <CardDescription>Filter servers by name.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Filter servers..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Columns</CardTitle>
                  <CardDescription>Select which columns to display.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) => column.getCanHide()
                    )
                    .map(
                      (column) => {
                        return (
                          <div key={column.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                              id={column.id}
                            />
                            <Label htmlFor={column.id} className="capitalize">
                              {column.id}
                            </Label>
                          </div>
                        )
                      })}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Date Range</CardTitle>
                  <CardDescription>Select a date range to filter servers.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-between items-center py-2">
              <ServerStats servers={servers} />
              <div>
                <Button variant="outline" size="sm" className="mr-2" onClick={exportData}>
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportExcelData}>
                  Export Excel
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {currentServers.map((server) => (
                    <TableRow key={server.id}>
                      {columns.map((column) => {
                        if (column.id === "select") {
                          // Handle the checkbox column specially
                          return (
                            <TableCell key={column.id}>
                              <Checkbox 
                                checked={rowSelection[server.id]}
                                onCheckedChange={(checked) => {
                                  setRowSelection(prev => ({
                                    ...prev,
                                    [server.id]: checked
                                  }));
                                }}
                              />
                            </TableCell>
                          );
                        }
                        
                        const columnId = column.id || ((column as any).accessorKey as string);
                        
                        // For cell rendering, handle specially based on column id
                        if (columnId === "cpuLoadTrend" && server.cpuLoadTrend) {
                          return (
                            <TableCell key={columnId}>
                              <SparklineChart data={server.cpuLoadTrend} />
                            </TableCell>
                          );
                        } else if (columnId === "tags" && server.tags) {
                          return (
                            <TableCell key={columnId}>
                              <div className="flex flex-wrap gap-1">
                                {server.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                            </TableCell>
                          );
                        } else if (columnId === "serverType") {
                          return (
                            <TableCell key={columnId}>
                              <Badge>{server.serverType}</Badge>
                            </TableCell>
                          );
                        } else if (columnId === "actions") {
                          return (
                            <TableCell key={columnId}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(server.id)}>
                                    Copy server ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View server</DropdownMenuItem>
                                  <DropdownMenuItem>Edit server</DropdownMenuItem>
                                  <DropdownMenuItem>Delete server</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          );
                        } else if (columnId === "createdAt" || columnId === "updatedAt" || columnId === "lastPatchDate") {
                          // Format dates
                          return (
                            <TableCell key={columnId}>
                              {formatDate(server[columnId as keyof Server] as string, true)}
                            </TableCell>
                          );
                        } else {
                          // Default rendering for other columns
                          return (
                            <TableCell key={columnId}>
                              {String(server[columnId as keyof Server] ?? '')}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) paginate(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(pageNumber);
                      }}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) paginate(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
