
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useServerStore from "@/store/serverStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServerTableActions = () => {
  const {
    search,
    setSearch,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    filteredServers,
  } = useServerStore();

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    if (currentPage > Math.ceil(filteredServers.length / parseInt(value))) {
      setCurrentPage(1);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center border-b">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Suche..."
            className="pl-8"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="10 pro Seite" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 pro Seite</SelectItem>
            <SelectItem value="20">20 pro Seite</SelectItem>
            <SelectItem value="50">50 pro Seite</SelectItem>
            <SelectItem value="100">100 pro Seite</SelectItem>
            <SelectItem value="250">250 pro Seite</SelectItem>
            <SelectItem value="500">500 pro Seite</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ServerTableActions;
