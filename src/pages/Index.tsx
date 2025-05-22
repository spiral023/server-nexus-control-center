
import ServerTable from "@/components/ServerTable";
import ServerPagination from "@/components/ServerPagination";
import ServerForm from "@/components/ServerForm";

const Index = () => {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Server Inventory</h1>
      <ServerTable />
      <ServerPagination />
      <ServerForm />
    </div>
  );
};

export default Index;
