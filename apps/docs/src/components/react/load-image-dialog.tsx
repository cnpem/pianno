import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import { useState, useReducer } from 'react';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const RAW_DATA_TYPES = ['float32', 'float64', 'int32'];

export default function LoadImageDialog() {
  const [open, setOpen] = useState(false);
  const [toggled, toggle] = useReducer((open) => !open, false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="animate-bounce" size="icon" variant="outline">
          <span className="sr-only">Load image</span>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load new image</DialogTitle>
          <DialogDescription>
            {toggled
              ? 'Fill in raw image metadata and click load.'
              : 'Click load.'}
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="flex flex-row items-center gap-2 text-center">
            <span className="font-mono font-semibold">PNG</span>
            <Switch checked={toggled} name="toggle" onCheckedChange={toggle} />
            <span className="font-mono font-semibold">RAW</span>
          </div>
          {toggled && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Label htmlFor="width">Width</Label>
              <Label htmlFor="height">Height</Label>
              <Label htmlFor="dtype">Data type</Label>
              <Input
                id="width"
                max={4096}
                min={1}
                name="width"
                required
                type="number"
              />
              <Input
                id="height"
                max={4096}
                min={1}
                name="height"
                required
                type="number"
              />
              <Select name="dtype" required>
                <SelectTrigger id="dtype">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RAW_DATA_TYPES.map((dtype) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={dtype}
                      value={dtype}
                    >
                      {dtype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button type="submit">Load</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
