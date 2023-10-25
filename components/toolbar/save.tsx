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
      extensions: ['.json'],
      fileName: 'annot.json',
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size={'icon'} title={'save json'} variant={'outline'}>
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
                      className="cursor-pointer"
                      key={device}
                      value={device}
                    >
                      {device}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-row items-center gap-2">
                <Label
                  className=" font-semibold text-muted-foreground"
                  htmlFor="device-hash"
                >
                  #
                </Label>
                <Input
                  className="w-full"
                  id="device-hash"
                  max={5}
                  min={1}
                  name="device-hash"
                  required
                  type="number"
                />
              </div>
              <Select name="geometry" required>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Geometry" />
                </SelectTrigger>
                <SelectContent>
                  {PIMEGA_GEOMETRIES.map((geometry) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={geometry}
                      value={geometry}
                    >
                      {geometry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label
                className="text-left text-xs font-semibold text-muted-foreground"
                htmlFor="distance"
              >
                Distance <span className="font-light">(mm)</span>
              </Label>
              <Input
                className="col-span-3"
                id="distance"
                min={0}
                name="distance"
                required
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-row gap-4">
              {!isCopied ? (
                <Button formAction={copyAction} type="submit" variant="outline">
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>
              ) : (
                <Button variant="outline">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied!
                </Button>
              )}
              <Button formAction={saveAction} type="submit" variant="default">
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
