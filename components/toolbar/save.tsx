'use client';

import { exportAnnotation } from '@/app/actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useStoreLabel } from '@/hooks/use-store';
import { PIMEGA_DEVICES, PIMEGA_GEOMETRIES } from '@/lib/constants';
import { annotationSchema } from '@/lib/types';
import { fileSave } from 'browser-fs-access';
import { BracesIcon, CheckIcon, CopyIcon, SaveIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { z } from 'zod';

interface SaveDialogProps {}

const SaveDialog: FC<SaveDialogProps> = ({}) => {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const label = useStoreLabel();

  const handleSaveClick = (data: z.infer<typeof annotationSchema>) => {
    // Create a blob of the data
    const fileToSave = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });
    // Save the file
    fileSave(fileToSave, {
      fileName: 'annot.json',
      extensions: ['.json'],
    })
      .then(() => {
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCopyClick = (data: z.infer<typeof annotationSchema>) => {
    // Save the file
    copy(JSON.stringify(data)).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    });
  };

  async function saveAction(data: FormData) {
    const res = await exportAnnotation(data, label);
    handleSaveClick(res);
  }

  async function copyAction(data: FormData) {
    const res = await exportAnnotation(data, label);
    handleCopyClick(res);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title={'save json'} variant={'outline'} size={'icon'}>
          <SaveIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save your Annotations</DialogTitle>
          <DialogDescription>
            Fill in the following fields with the annotation metadata. Click
            save or copy to clipboard when you are done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-2">
              <Select name="device" required>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  {PIMEGA_DEVICES.map((device) => (
                    <SelectItem
                      key={device}
                      value={device}
                      className="cursor-pointer"
                    >
                      {device}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-row items-center gap-2">
                <Label
                  htmlFor="device-hash"
                  className=" font-semibold text-muted-foreground"
                >
                  #
                </Label>
                <Input
                  id="device-hash"
                  name="device-hash"
                  type="number"
                  className="w-full"
                  min={1}
                  max={5}
                  required
                />
              </div>
              <Select name="geometry" required>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Geometry" />
                </SelectTrigger>
                <SelectContent>
                  {PIMEGA_GEOMETRIES.map((geometry) => (
                    <SelectItem
                      key={geometry}
                      value={geometry}
                      className="cursor-pointer"
                    >
                      {geometry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label
                htmlFor="distance"
                className="text-left text-xs font-semibold text-muted-foreground"
              >
                Distance <span className="font-light">(mm)</span>
              </Label>
              <Input
                id="distance"
                name="distance"
                type="number"
                className="col-span-3"
                min={0}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-row gap-4">
              {!isCopied ? (
                <Button variant="outline" type="submit" formAction={copyAction}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>
              ) : (
                <Button variant="outline">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied!
                </Button>
              )}
              <Button variant="default" type="submit" formAction={saveAction}>
                <BracesIcon className="mr-2 h-4 w-4" />
                Save JSON
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
