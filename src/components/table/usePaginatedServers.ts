
import { useState, useEffect } from 'react';
import { Server } from '@/types/server';

export const usePaginatedServers = (
  filteredServers: Server[],
  currentPage: number,
  itemsPerPage: number
) => {
  const [paginatedServers, setPaginatedServers] = useState<Server[]>([]);
  
  // Update paginated servers when filtered servers or pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedServers(filteredServers.slice(startIndex, endIndex));
  }, [filteredServers, currentPage, itemsPerPage]);
  
  return paginatedServers;
};
