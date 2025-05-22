
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyTableRowProps {
  colSpan: number;
}

const EmptyTableRow = ({ colSpan }: EmptyTableRowProps) => {
  return (
    <TableRow>
      <TableCell 
        colSpan={colSpan}
        className="h-32 text-center text-muted-foreground"
      >
        No servers found
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
