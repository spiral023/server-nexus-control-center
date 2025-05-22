
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate, getServerTypeColor, getHardwareTypeColor, getBackupStatusColor } from '@/lib/utils';
import { Server } from '@/types/server';
import { Check, ChevronDown, X } from "lucide-react";

interface ServerTableRowProps {
  server: Server;
  visibleColumns: (keyof Server)[];
  selectedServers: string[];
  toggleServerSelection: (id: string) => void;
  handleRowClick: (server: Server) => void;
  setSelectedServer: (server: Server) => void;
  openModal: () => void;
}

const ServerTableRow = ({
  server,
  visibleColumns,
  selectedServers,
  toggleServerSelection,
  handleRowClick,
  setSelectedServer,
  openModal
}: ServerTableRowProps) => {
  
  // Render cell content based on column type
  const renderCellContent = (server: Server, column: keyof Server) => {
    const value = server[column];
    
    switch (column) {
      case 'serverName':
        return <span className="font-medium">{value as string}</span>;
      
      case 'serverType':
        return (
          <Badge className={`${getServerTypeColor(value as string)}`}>
            {value as string}
          </Badge>
        );
      
      case 'hardwareType':
        return (
          <Badge variant="outline" className={`${getHardwareTypeColor(value as string)}`}>
            {value as string}
          </Badge>
        );
      
      case 'backup':
        return (
          <span className={getBackupStatusColor(value as string)}>
            {value === 'Yes' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </span>
        );
      
      case 'createdAt':
      case 'updatedAt':
        return formatDate(value as string);
      
      case 'tags':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {(value as string[]).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-tag/10 text-tag border border-tag/20">
                  {tag}
                </Badge>
              ))}
            </div>
          );
        }
        return <span className="text-muted-foreground text-sm">No tags</span>;
      
      default:
        return typeof value === 'string' ? value : JSON.stringify(value);
    }
  };

  return (
    <TableRow 
      key={server.id}
      className="group hover:bg-muted/50 cursor-pointer"
    >
      <TableCell className="sticky left-0 bg-background group-hover:bg-muted/50 z-10">
        <Checkbox 
          checked={selectedServers.includes(server.id)}
          onCheckedChange={() => toggleServerSelection(server.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      
      {visibleColumns.map((column) => (
        <TableCell 
          key={`${server.id}-${column}`}
          onClick={() => handleRowClick(server)}
        >
          {renderCellContent(server, column)}
        </TableCell>
      ))}
      
      <TableCell className="text-right w-[60px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedServer(server);
            openModal();
          }}
        >
          <span className="sr-only">Open</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ServerTableRow;
