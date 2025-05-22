
import { Table, TableBody } from "@/components/ui/table";
import useServerStore from '@/store/serverStore';
import { Server } from '@/types/server';
import ServerDetailModal from './ServerDetailModal';
import ServerTableActions from './ServerTableActions';
import ServerTableHeader from './table/ServerTableHeader';
import ServerTableRow from './table/ServerTableRow';
import EmptyTableRow from './table/EmptyTableRow';
import { usePaginatedServers } from './table/usePaginatedServers';

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
  
  const paginatedServers = usePaginatedServers(filteredServers, currentPage, itemsPerPage);
  
  // Check if all servers on current page are selected
  const allSelected = paginatedServers.length > 0 && 
    paginatedServers.every(server => selectedServers.includes(server.id));
  
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
  
  // Handle row click
  const handleRowClick = (server: Server) => {
    setSelectedServer(server);
    openModal();
  };

  return (
    <div className="rounded-md border">
      <ServerTableActions />
      <div className="relative overflow-x-auto">
        <Table>
          <ServerTableHeader 
            visibleColumns={visibleColumns}
            allSelected={allSelected}
            selectAllServers={selectAllServers}
            sorting={sorting}
            handleSort={handleSort}
          />
          <TableBody>
            {paginatedServers.length === 0 ? (
              <EmptyTableRow colSpan={visibleColumns.length + 2} />
            ) : (
              paginatedServers.map((server) => (
                <ServerTableRow 
                  key={server.id}
                  server={server}
                  visibleColumns={visibleColumns}
                  selectedServers={selectedServers}
                  toggleServerSelection={toggleServerSelection}
                  handleRowClick={handleRowClick}
                  setSelectedServer={setSelectedServer}
                  openModal={openModal}
                />
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
