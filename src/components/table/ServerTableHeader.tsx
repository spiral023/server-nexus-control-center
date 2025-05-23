
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Server, ServerSort } from "@/types/server";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ServerTableHeaderProps {
  visibleColumns: (keyof Server)[];
  allSelected: boolean;
  selectAllServers: () => void;
  sorting: ServerSort[];
  handleSort: (column: keyof Server) => void;
}

const ServerTableHeader = ({
  visibleColumns,
  allSelected,
  selectAllServers,
  sorting,
  handleSort
}: ServerTableHeaderProps) => {
  
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
  
  return (
    <TableHeader className="bg-muted/50">
      <TableRow>
        <TableHead className="w-[40px] sticky left-0 bg-muted/50 z-10">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={selectAllServers}
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
  );
};

export default ServerTableHeader;
