
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import useServerStore from '@/store/serverStore';
import { formatDate, getServerTypeColor, getHardwareTypeColor, getBackupStatusColor } from '@/lib/utils';
import { Server } from '@/types/server';
import ServerDetailModal from './ServerDetailModal';
import ServerTableActions from './ServerTableActions';

const ServerTable = () => {
  const { 
    filteredServers, 
    visibleColumns, 
    setSelectedServer, 
    selectedServers, 
    toggleServerSelection,
    selectAllServers,
    sorting,
    setSorting,
    currentPage,
    itemsPerPage,
    openModal
  } = useServerStore();
  
  const [paginatedServers, setPaginatedServers] = useState<Server[]>([]);
  
  // Update paginated servers when filtered servers or pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedServers(filteredServers.slice(startIndex, endIndex));
  }, [filteredServers, currentPage, itemsPerPage]);
  
  // Check if all servers on current page are selected
  const allSelected = paginatedServers.length > 0 && 
    paginatedServers.every(server => selectedServers.includes(server.id));
  
  // Check if some servers on current page are selected
  const someSelected = paginatedServers.some(server => selectedServers.includes(server.id));
  
  // Handle sort
  const handleSort = (column: keyof Server) => {
    const currentSortIndex = sorting.findIndex(sort => sort.key === column);
    let newSorting = [...sorting];
    
    if (currentSortIndex >= 0) {
      // Toggle direction if already sorting by this column
      if (sorting[currentSortIndex].direction === 'asc') {
        newSorting[currentSortIndex] = { key: column, direction: 'desc' };
      } else {
        // Remove this sort if already desc
        newSorting.splice(currentSortIndex, 1);
      }
    } else {
      // Add new sort
      newSorting = [{ key: column, direction: 'asc' }, ...newSorting];
      
      // Limit to 3 active sorts
      if (newSorting.length > 3) {
        newSorting = newSorting.slice(0, 3);
      }
    }
    
    setSorting(newSorting);
  };
  
  // Get sort icon for column
  const getSortIcon = (column: keyof Server) => {
    const sort = sorting.find(s => s.key === column);
    if (!sort) return null;
    
    const sortIndex = sorting.findIndex(s => s.key === column);
    
    return (
      <div className="inline-flex flex-col ml-1">
        {sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {sorting.length > 1 && (
          <span className="text-[10px] text-muted-foreground">{sortIndex + 1}</span>
        )}
      </div>
    );
  };
  
  // Handle row click
  const handleRowClick = (server: Server) => {
    setSelectedServer(server);
    openModal();
  };
  
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
    <div className="rounded-md border">
      <ServerTableActions />
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px] sticky left-0 bg-muted/50 z-10">
                <Checkbox 
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onCheckedChange={() => selectAllServers()}
                />
              </TableHead>
              
              {visibleColumns.map((column) => (
                <TableHead 
                  key={column} 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
              
              <TableHead className="w-[60px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServers.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length + 2}
                  className="h-32 text-center text-muted-foreground"
                >
                  No servers found
                </TableCell>
              </TableRow>
            ) : (
              paginatedServers.map((server) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ServerDetailModal />
    </div>
  );
};

export default ServerTable;
