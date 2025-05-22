
import { create } from 'zustand';
import { Server, ServerFilter, ServerSort, ServerView, ServerHistory } from '../types/server';
import { generateMockServers, generateServerHistory, generateLargeBatchOfServers } from '../lib/mockData';

export interface ServerState {
  servers: Server[];
  filteredServers: Server[];
  selectedServer: Server | null;
  filters: ServerFilter[];
  search: string;
  sorting: ServerSort[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  visibleColumns: (keyof Server)[];
  savedViews: ServerView[];
  activeView: string | null;
  serverHistory: Record<string, ServerHistory[]>;
  selectedServers: string[];
  isModalOpen: boolean;
  isFormOpen: boolean;
  formMode: 'create' | 'edit';
  
  // Actions
  setServers: (servers: Server[]) => void;
  setSelectedServer: (server: Server | null) => void;
  addServer: (server: Server) => void;
  updateServer: (serverId: string, updates: Partial<Server>) => void;
  deleteServer: (serverId: string) => void;
  deleteMultipleServers: (serverIds: string[]) => void;
  addFilter: (filter: ServerFilter) => void;
  removeFilter: (index: number) => void;
  resetFilters: () => void;
  setSearch: (search: string) => void;
  setSorting: (sorting: ServerSort[]) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleColumnVisibility: (column: keyof Server) => void;
  setVisibleColumns: (columns: (keyof Server)[]) => void;
  saveView: (name: string) => void;
  loadView: (viewId: string) => void;
  deleteView: (viewId: string) => void;
  toggleServerSelection: (serverId: string) => void;
  selectAllServers: () => void;
  clearSelectedServers: () => void;
  bulkTagServers: (tag: string) => void;
  openModal: () => void;
  closeModal: () => void;
  openForm: (mode: 'create' | 'edit') => void;
  closeForm: () => void;
}

const useServerStore = create<ServerState>((set, get) => {
  // Generate initial mock data with more servers
  const mockServers = generateLargeBatchOfServers(1580); // 80 + 1500 new servers
  const mockHistory: Record<string, ServerHistory[]> = {};
  
  // Generate history for each server (only for the first 100 to avoid performance issues)
  mockServers.slice(0, 100).forEach(server => {
    mockHistory[server.id] = generateServerHistory(server, 5); 
  });
  
  const defaultVisibleColumns: (keyof Server)[] = [
    'serverName', 'operatingSystem', 'hardwareType', 'company', 
    'serverType', 'location', 'ipAddress', 'backup'
  ];
  
  return {
    servers: mockServers,
    filteredServers: mockServers,
    selectedServer: null,
    filters: [],
    search: '',
    sorting: [{ key: 'serverName', direction: 'asc' }],
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: Math.ceil(mockServers.length / 20),
    visibleColumns: defaultVisibleColumns,
    savedViews: [],
    activeView: null,
    serverHistory: mockHistory,
    selectedServers: [],
    isModalOpen: false,
    isFormOpen: false,
    formMode: 'create',
    
    // Set all servers
    setServers: (servers) => {
      set((state) => {
        const filteredServers = applyFiltersAndSearch(servers, state.filters, state.search);
        return {
          servers,
          filteredServers,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Set selected server
    setSelectedServer: (server) => {
      set({ selectedServer: server });
    },
    
    // Add a new server
    addServer: (server) => {
      set((state) => {
        // Ensure server has all required fields and default values for new fields
        const newServer: Server = {
          ...server,
          // If these fields are not provided, set default values
          cores: server.cores || 1,
          ramGB: server.ramGB || 4,
          storageGB: server.storageGB || 100,
          vsphereCluster: server.vsphereCluster || '',
          application: server.application || '',
          patchStatus: server.patchStatus || 'aktuell',
          lastPatchDate: server.lastPatchDate || new Date().toISOString(),
          cpuLoadTrend: server.cpuLoadTrend || Array(24).fill(0),
          alarmCount: server.alarmCount || 0,
          // Ensure these fields always exist
          serverName: server.serverName,
          operatingSystem: server.operatingSystem,
          hardwareType: server.hardwareType,
          company: server.company,
          serverType: server.serverType,
          location: server.location,
          systemAdmin: server.systemAdmin,
          backupAdmin: server.backupAdmin,
          hardwareAdmin: server.hardwareAdmin,
          description: server.description,
          domain: server.domain,
          maintenanceWindow: server.maintenanceWindow,
          ipAddress: server.ipAddress,
          applicationZone: server.applicationZone,
          operationalZone: server.operationalZone,
          backup: server.backup,
          tags: server.tags || [],
        };
        
        const updatedServers = [...state.servers, newServer];
        const updatedFilteredServers = applyFiltersAndSearch(
          updatedServers, 
          state.filters, 
          state.search
        );
        
        return {
          servers: updatedServers,
          filteredServers: updatedFilteredServers,
          totalPages: Math.ceil(updatedFilteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Update an existing server
    updateServer: (serverId, updates) => {
      set((state) => {
        // Update the server in the array
        const updatedServers = state.servers.map(server => 
          server.id === serverId 
            ? { ...server, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'Aktueller Benutzer' } 
            : server
        );
        
        // Apply filters again
        const updatedFilteredServers = applyFiltersAndSearch(
          updatedServers, 
          state.filters, 
          state.search
        );
        
        // Create history record
        const oldServer = state.servers.find(s => s.id === serverId);
        if (oldServer) {
          const history = state.serverHistory[serverId] || [];
          const newHistory: ServerHistory[] = [];
          
          // Add history entry for each changed field
          Object.keys(updates).forEach(key => {
            const fieldKey = key as keyof Server;
            if (oldServer[fieldKey] !== updates[fieldKey] && fieldKey !== 'updatedAt' && fieldKey !== 'updatedBy') {
              newHistory.push({
                id: Math.random().toString(36).substring(2, 11),
                serverId: serverId,
                field: fieldKey,
                oldValue: String(oldServer[fieldKey] || ''),
                newValue: String(updates[fieldKey] || ''),
                timestamp: new Date().toISOString(),
                user: 'Aktueller Benutzer'
              });
            }
          });
          
          if (newHistory.length > 0) {
            const updatedHistory = {
              ...state.serverHistory,
              [serverId]: [...history, ...newHistory]
            };
            
            return {
              servers: updatedServers,
              filteredServers: updatedFilteredServers,
              totalPages: Math.ceil(updatedFilteredServers.length / state.itemsPerPage),
              serverHistory: updatedHistory
            };
          }
        }
        
        return {
          servers: updatedServers,
          filteredServers: updatedFilteredServers,
          totalPages: Math.ceil(updatedFilteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Delete a server
    deleteServer: (serverId) => {
      set((state) => {
        const updatedServers = state.servers.filter(server => server.id !== serverId);
        const updatedFilteredServers = applyFiltersAndSearch(
          updatedServers, 
          state.filters, 
          state.search
        );
        
        // Remove server from selections if it's there
        const updatedSelections = state.selectedServers.filter(id => id !== serverId);
        
        // Remove history for the deleted server
        const { [serverId]: _, ...updatedHistory } = state.serverHistory;
        
        return {
          servers: updatedServers,
          filteredServers: updatedFilteredServers,
          selectedServers: updatedSelections,
          totalPages: Math.ceil(updatedFilteredServers.length / state.itemsPerPage),
          serverHistory: updatedHistory
        };
      });
    },
    
    // Delete multiple servers
    deleteMultipleServers: (serverIds) => {
      set((state) => {
        const updatedServers = state.servers.filter(server => !serverIds.includes(server.id));
        const updatedFilteredServers = applyFiltersAndSearch(
          updatedServers, 
          state.filters, 
          state.search
        );
        
        // Remove deleted servers from selections
        const updatedSelections = state.selectedServers.filter(id => !serverIds.includes(id));
        
        // Remove history for deleted servers
        const updatedHistory = { ...state.serverHistory };
        serverIds.forEach(id => {
          delete updatedHistory[id];
        });
        
        return {
          servers: updatedServers,
          filteredServers: updatedFilteredServers,
          selectedServers: updatedSelections,
          totalPages: Math.ceil(updatedFilteredServers.length / state.itemsPerPage),
          serverHistory: updatedHistory
        };
      });
    },
    
    // Add a filter
    addFilter: (filter) => {
      set((state) => {
        const updatedFilters = [...state.filters, filter];
        const filteredServers = applyFiltersAndSearch(
          state.servers, 
          updatedFilters, 
          state.search
        );
        
        return {
          filters: updatedFilters,
          filteredServers,
          currentPage: 1,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Remove a filter
    removeFilter: (index) => {
      set((state) => {
        const updatedFilters = [...state.filters];
        updatedFilters.splice(index, 1);
        
        const filteredServers = applyFiltersAndSearch(
          state.servers, 
          updatedFilters, 
          state.search
        );
        
        return {
          filters: updatedFilters,
          filteredServers,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Reset all filters
    resetFilters: () => {
      set((state) => {
        const filteredServers = applyFiltersAndSearch(
          state.servers, 
          [], 
          state.search
        );
        
        return {
          filters: [],
          filteredServers,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Set search text
    setSearch: (search) => {
      set((state) => {
        const filteredServers = applyFiltersAndSearch(
          state.servers, 
          state.filters, 
          search
        );
        
        return {
          search,
          filteredServers,
          currentPage: 1,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Set sorting
    setSorting: (sorting) => {
      set((state) => {
        const sortedServers = applySorting([...state.filteredServers], sorting);
        return { sorting, filteredServers: sortedServers };
      });
    },
    
    // Set current page
    setCurrentPage: (page) => {
      set({ currentPage: page });
    },
    
    // Set items per page
    setItemsPerPage: (count) => {
      set((state) => ({
        itemsPerPage: count,
        totalPages: Math.ceil(state.filteredServers.length / count),
        currentPage: 1
      }));
    },
    
    // Toggle column visibility
    toggleColumnVisibility: (column) => {
      set((state) => {
        const isVisible = state.visibleColumns.includes(column);
        let updatedColumns: (keyof Server)[];
        
        if (isVisible) {
          // Don't allow removing the last column
          if (state.visibleColumns.length <= 1) {
            return state;
          }
          updatedColumns = state.visibleColumns.filter(col => col !== column);
        } else {
          updatedColumns = [...state.visibleColumns, column];
        }
        
        return { visibleColumns: updatedColumns };
      });
    },
    
    // Set visible columns
    setVisibleColumns: (columns) => {
      set({ visibleColumns: columns });
    },
    
    // Save current view
    saveView: (name) => {
      set((state) => {
        const newView: ServerView = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          userId: 'current-user',
          filters: [...state.filters],
          visibleColumns: [...state.visibleColumns],
          sortOrder: [...state.sorting]
        };
        
        return { 
          savedViews: [...state.savedViews, newView],
          activeView: newView.id
        };
      });
    },
    
    // Load a saved view
    loadView: (viewId) => {
      set((state) => {
        const view = state.savedViews.find(v => v.id === viewId);
        if (!view) return state;
        
        const filteredServers = applyFiltersAndSearch(
          state.servers, 
          view.filters, 
          state.search
        );
        
        return {
          filters: [...view.filters],
          visibleColumns: [...view.visibleColumns],
          sorting: [...view.sortOrder],
          filteredServers: applySorting(filteredServers, view.sortOrder),
          activeView: viewId,
          currentPage: 1,
          totalPages: Math.ceil(filteredServers.length / state.itemsPerPage)
        };
      });
    },
    
    // Delete a saved view
    deleteView: (viewId) => {
      set((state) => {
        const updatedViews = state.savedViews.filter(view => view.id !== viewId);
        const activeView = state.activeView === viewId ? null : state.activeView;
        return { savedViews: updatedViews, activeView };
      });
    },
    
    // Toggle server selection
    toggleServerSelection: (serverId) => {
      set((state) => {
        const isSelected = state.selectedServers.includes(serverId);
        let updatedSelections: string[];
        
        if (isSelected) {
          updatedSelections = state.selectedServers.filter(id => id !== serverId);
        } else {
          updatedSelections = [...state.selectedServers, serverId];
        }
        
        return { selectedServers: updatedSelections };
      });
    },
    
    // Select all servers on current page
    selectAllServers: () => {
      set((state) => {
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const currentPageServers = state.filteredServers.slice(startIndex, endIndex);
        const currentPageIds = currentPageServers.map(server => server.id);
        
        // Check if all are already selected
        const allSelected = currentPageIds.every(id => 
          state.selectedServers.includes(id)
        );
        
        if (allSelected) {
          // Deselect all on current page
          const updatedSelections = state.selectedServers.filter(
            id => !currentPageIds.includes(id)
          );
          return { selectedServers: updatedSelections };
        } else {
          // Select all on current page
          const existingSelections = new Set(state.selectedServers);
          currentPageIds.forEach(id => existingSelections.add(id));
          return { selectedServers: Array.from(existingSelections) };
        }
      });
    },
    
    // Clear all server selections
    clearSelectedServers: () => {
      set({ selectedServers: [] });
    },
    
    // Bulk add tag to selected servers
    bulkTagServers: (tag) => {
      set((state) => {
        const { selectedServers, servers } = state;
        if (selectedServers.length === 0) return state;
        
        const updatedServers = servers.map(server => {
          if (selectedServers.includes(server.id)) {
            // Don't add duplicate tags
            if (!server.tags.includes(tag)) {
              return {
                ...server,
                tags: [...server.tags, tag],
                updatedAt: new Date().toISOString(),
                updatedBy: 'Current User'
              };
            }
          }
          return server;
        });
        
        const filteredServers = applyFiltersAndSearch(
          updatedServers, 
          state.filters, 
          state.search
        );
        
        // Update history for each modified server
        const updatedHistory = { ...state.serverHistory };
        selectedServers.forEach(serverId => {
          const server = servers.find(s => s.id === serverId);
          if (server && !server.tags.includes(tag)) {
            const history = updatedHistory[serverId] || [];
            const historyEntry: ServerHistory = {
              id: Math.random().toString(36).substring(2, 11),
              serverId,
              field: 'tags',
              oldValue: server.tags.join(', '),
              newValue: [...server.tags, tag].join(', '),
              timestamp: new Date().toISOString(),
              user: 'Current User'
            };
            updatedHistory[serverId] = [...history, historyEntry];
          }
        });
        
        return {
          servers: updatedServers,
          filteredServers,
          serverHistory: updatedHistory
        };
      });
    },
    
    // Modal controls
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    
    // Form controls
    openForm: (mode) => set({ isFormOpen: true, formMode: mode }),
    closeForm: () => set({ isFormOpen: false })
  };
});

// Helper functions for filtering, searching and sorting
function applyFiltersAndSearch(
  servers: Server[], 
  filters: ServerFilter[], 
  search: string
): Server[] {
  // Apply filters first
  let result = servers;
  
  if (filters.length > 0) {
    result = result.filter(server => {
      return filters.every(filter => {
        if (filter.key === 'all') return true;
        
        const value = server[filter.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(filter.value.toLowerCase())
          );
        }
        return false;
      });
    });
  }
  
  // Then apply search across all fields
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(server => {
      return Object.values(server).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        } else if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    });
  }
  
  return result;
}

function applySorting(servers: Server[], sorting: ServerSort[]): Server[] {
  if (sorting.length === 0) return servers;
  
  return [...servers].sort((a, b) => {
    for (const sort of sorting) {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      
      // Handle different types
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      // Apply direction
      if (comparison !== 0) {
        return sort.direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

export default useServerStore;
