
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useServerStore from "@/store/serverStore";

interface SaveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveViewDialog = ({ open, onOpenChange }: SaveViewDialogProps) => {
  const [viewName, setViewName] = useState('');
  const { saveView } = useServerStore();
  
  const handleSave = () => {
    if (viewName.trim()) {
      saveView(viewName.trim());
      onOpenChange(false);
      setViewName('');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save View</DialogTitle>
          <DialogDescription>
            Save the current filters, column visibility, and sorting options as a named view.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="viewName">View Name</Label>
          <Input
            id="viewName"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="Enter a name for this view"
            className="mt-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!viewName.trim()}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveViewDialog;
