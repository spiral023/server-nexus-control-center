
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tag, X } from "lucide-react";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commonTags = [
  'Critical', 'High-Priority', 'Legacy', 'Maintenance-Required',
  'Migration-Pending', 'Production', 'Test', 'Development',
  'Backup-Issue', 'Security-Risk', 'End-of-Life'
];

const TagDialog = ({ open, onOpenChange }: TagDialogProps) => {
  const [newTag, setNewTag] = useState('');
  const { bulkTagServers, selectedServers } = useServerStore();
  
  const handleAddTag = (tag: string) => {
    if (tag.trim()) {
      bulkTagServers(tag.trim());
      toast.success(`Added tag "${tag}" to ${selectedServers.length} servers`);
      onOpenChange(false);
      setNewTag('');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
          <DialogDescription>
            Add a tag to {selectedServers.length} selected servers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="tagName">Tag Name</Label>
          <div className="flex mt-1">
            <Input
              id="tagName"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a tag name"
              className="rounded-r-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag(newTag);
              }}
            />
            <Button 
              className="rounded-l-none"
              onClick={() => handleAddTag(newTag)}
              disabled={!newTag.trim()}
            >
              <Tag className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="mt-6">
            <Label>Common Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonTags.map(tag => (
                <Badge 
                  key={tag}
                  variant="outline"
                  className="cursor-pointer bg-muted/50 hover:bg-muted"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
