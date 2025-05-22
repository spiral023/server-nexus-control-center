
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import useServerStore from "@/store/serverStore";

interface ServerHistoryTableProps {
  serverId: string;
}

const ServerHistoryTable = ({ serverId }: ServerHistoryTableProps) => {
  const { serverHistory } = useServerStore();
  const history = serverHistory[serverId] || [];
  
  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No history available for this server.
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Old Value</TableHead>
            <TableHead>New Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {formatDate(entry.timestamp, true)}
              </TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell>
                {entry.field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </TableCell>
              <TableCell className="text-muted-foreground">{entry.oldValue}</TableCell>
              <TableCell>{entry.newValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServerHistoryTable;
