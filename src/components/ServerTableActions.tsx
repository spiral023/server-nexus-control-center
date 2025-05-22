
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useServerStore from '@/store/serverStore';
import { exportToCSV, exportToExcel } from '@/lib/utils';
import { Server } from '@/types/server';
import { 
  Search, Filter, Plus, Download, Trash2, Tag, 
  SortDesc, ChevronDown, Columns, History, Check, X 
} from 'lucide-react';
import SaveViewDialog from './SaveViewDialog';
import TagDialog from './TagDialog';

const ServerTableActions = () => {
  const {
    setSearch,
    search,
    filters,
    addFilter,
    removeFilter,
    resetFilters,
    servers,
    filteredServers,
    openForm,
    visibleColumns,
    toggleColumnVisibility,
    savedViews,
    loadView,
    deleteView,
    activeView,
    selectedServers,
    deleteMultipleServers,
    clearSelectedServers,
  } = useServerStore();
  
  const [filterKey, setFilterKey] = useState<keyof Server | 'all'>('all');
  const [filterValue, setFilterValue] = useState('');
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  
  // Column options for the dropdown
  const columnOptions: { label: string; value: keyof Server }[] = [
    { label: 'Server Name', value: 'serverName' },
    { label: 'Operating System', value: 'operatingSystem' },
    { label: 'Hardware Type', value: 'hardwareType' },
    { label: 'Company', value: 'company' },
    { label: 'Server Type', value: 'serverType' },
    { label: 'Location', value: 'location' },
    { label: 'System Admin', value: 'systemAdmin' },
    { label: 'Backup Admin', value: 'backupAdmin' },
    { label: 'Hardware Admin', value: 'hardwareAdmin' },
    { label: 'Description', value: 'description' },
    { label: 'Domain', value: 'domain' },
    { label: 'Maintenance Window', value: 'maintenanceWindow' },
    { label: 'IP Address', value: 'ipAddress' },
    { label: 'Application Zone', value: 'applicationZone' },
    { label: 'Operational Zone', value: 'operationalZone' },
    { label: 'Backup', value: 'backup' },
    { label: 'Tags', value: 'tags' },
    { label: 'Created At', value: 'createdAt' },
    { label: 'Updated At', value: 'updatedAt' },
    { label: 'Updated By', value: 'updatedBy' },
  ];
  
  // Handle filter addition
  const handleAddFilter = () => {
    if (filterValue.trim()) {
      addFilter({ key: filterKey, value: filterValue.trim() });
      setFilterValue('');
    }
  };
  
  // Handle export CSV
  const handleExportCSV = () => {
    exportToCSV(filteredServers, visibleColumns);
  };
  
  // Handle export Excel
  const handleExportExcel = () => {
    exportToExcel(filteredServers, visibleColumns);
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedServers.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedServers.length} servers?`)) {
        deleteMultipleServers(selectedServers);
        clearSelectedServers();
      }
    }
  };
  
  return (
    <div className="bg-muted/30 border-b p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left side - search and filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterKey} onValueChange={(value) => setFilterKey(value as keyof Server)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {columnOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex">
              <Input
                placeholder="Filter value..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="rounded-r-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFilter();
                }}
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-l-none"
                onClick={handleAddFilter}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - actions */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Button variant="default" onClick={() => openForm('create')}>
            <Plus className="h-4 w-4 mr-1" /> Add Server
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" /> Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns className="h-4 w-4 mr-1" /> Columns
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {columnOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleColumnVisibility(option.value);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${visibleColumns.includes(option.value) ? 'bg-primary border-primary' : 'border-muted'}`}>
                      {visibleColumns.includes(option.value) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SortDesc className="h-4 w-4 mr-1" /> Views
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                Save Current View
              </DropdownMenuItem>
              
              {savedViews.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {savedViews.map(view => (
                    <DropdownMenuItem 
                      key={view.id} 
                      className="flex justify-between"
                      onSelect={(e) => {
                        e.preventDefault();
                        loadView(view.id);
                      }}
                    >
                      <span className={`${view.id === activeView ? 'font-medium' : ''}`}>
                        {view.name}
                      </span>
                      
                      {view.id === activeView && (
                        <Badge variant="secondary" className="ml-2 text-xs">Active</Badge>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteView(view.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedServers.length > 0 && (
            <>
              <Button 
                variant="outline" 
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete ({selectedServers.length})
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowTagDialog(true)}
              >
                <Tag className="h-4 w-4 mr-1" /> Tag ({selectedServers.length})
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {filters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="pl-2 flex items-center gap-1">
              {filter.key !== 'all' ? `${filter.key}: ${filter.value}` : filter.value}
              <button 
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => removeFilter(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={resetFilters}
          >
            Clear All
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredServers.length} of {servers.length} servers
          </div>
        </div>
      )}
      
      <SaveViewDialog open={showViewDialog} onOpenChange={setShowViewDialog} />
      <TagDialog open={showTagDialog} onOpenChange={setShowTagDialog} />
    </div>
  );
};

export default ServerTableActions;
