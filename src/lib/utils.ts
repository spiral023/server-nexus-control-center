
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Server } from "../types/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date to a localized string
export function formatDate(dateStr: string, includeTime = false): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }
    
    return new Intl.DateTimeFormat('de-DE', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Error';
  }
}

// Get color class based on server type
export function getServerTypeColor(serverType: string): string {
  switch (serverType) {
    case 'Production':
      return 'bg-status-prod text-white';
    case 'Test':
      return 'bg-status-test text-white';
    case 'Development':
      return 'bg-status-dev text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

// Get color class for hardware type
export function getHardwareTypeColor(hardwareType: string): string {
  switch (hardwareType) {
    case 'VMware':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Bare-Metal':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

// Get color class for backup status
export function getBackupStatusColor(backup: string): string {
  switch (backup) {
    case 'Yes':
      return 'text-green-600';
    case 'No':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

// Export data to CSV
export function exportToCSV(servers: Server[], visibleColumns: (keyof Server)[]): void {
  // Prepare headers
  const headers = visibleColumns.map(column => {
    // Convert camelCase to Title Case
    return column.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  });
  
  // Prepare rows
  const rows = servers.map(server => {
    return visibleColumns.map(column => {
      const value = server[column];
      
      // Format value based on type
      if (typeof value === 'string') {
        if (column === 'createdAt' || column === 'updatedAt') {
          return formatDate(value, true);
        }
        // Escape CSV special characters
        return `"${value.replace(/"/g, '""')}"`;
      } else if (Array.isArray(value)) {
        return `"${value.join(', ')}"`;
      } else {
        return `"${value}"`;
      }
    });
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `server-export-${formatDate(new Date().toISOString(), false).replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert server data to Excel format
export function exportToExcel(servers: Server[], visibleColumns: (keyof Server)[]): void {
  // In a real app, you would use a library like xlsx or exceljs
  // For this example, we'll redirect to CSV as a fallback
  exportToCSV(servers, visibleColumns);
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Get pagination range
export function getPaginationRange(
  currentPage: number, 
  totalPages: number,
  maxDisplayed = 7
): number[] {
  if (totalPages <= maxDisplayed) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Always show first, last, current and pages around current
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayed / 2));
  let endPage = startPage + maxDisplayed - 1;
  
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxDisplayed + 1);
  }
  
  const result = [];
  
  // Always add first page
  result.push(1);
  
  // Add ellipsis if needed
  if (startPage > 2) {
    result.push(-1); // -1 represents ellipsis
  }
  
  // Add pages in range
  for (let i = Math.max(2, startPage); i <= Math.min(totalPages - 1, endPage); i++) {
    result.push(i);
  }
  
  // Add ellipsis if needed
  if (endPage < totalPages - 1) {
    result.push(-1); // -1 represents ellipsis
  }
  
  // Always add last page if it's not already included
  if (totalPages > 1) {
    result.push(totalPages);
  }
  
  return result;
}
