'use client';

import { exportAnnotation, getAnnotationGroup } from '@/app/actions';
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { ANNOTATION_DISTANCE_TYPES } from '@/lib/constants';
import { AnnotationGroup, annotationSchema } from '@/lib/types';
import { fileSave } from 'browser-fs-access';
import { BracesIcon, CheckIcon, CopyIcon, SaveIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { z } from 'zod';

import { PreviewCanvas } from '../canvas';

interface SaveDialogProps {
  disabled?: boolean;
}

const SaveDialog: FC<SaveDialogProps> = ({ disabled }) => {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const label = useStoreLabel();

  const [pairs, setPairs] = useState<AnnotationGroup | null>(null);

  useEffect(() => {
    getAnnotationGroup(label).then((res) => {
      setPairs(res);
    });
  }, [label]);

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
        handleOpenChange(false);
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

  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (!open) {
      window.location.reload();
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size={'icon'}
          title={'save json'}
          variant={'outline'}
        >
          <SaveIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
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
          <div className="mb-2 flex flex-row items-center gap-2">
            <div className="border-2 border-red-800">
              <PreviewCanvas />
            </div>

            <ScrollArea className="h-[200px] border-2 border-purple-800">
              <div className="flex flex-col gap-2">
                {Object.keys(pairs || {}).map((key, index) => (
                  <div
                    className={
                      'flex flex-row items-center gap-2 rounded-md p-2'
                    }
                    key={key}
                  > 
                  <div className='rounded-md p-2 w-full text-center items-center justify-center' style={{ backgroundColor: key }}>
                    <p
                      className= 'text-xs font-semibold text-white'
                      
                    >
                      {index}
                    </p>
                  </div>
                    <Label
                      className="text-left text-xs font-semibold text-muted-foreground"
                      htmlFor={'pair-distance'}
                    >
                      distance
                    </Label>
                    <Input
                      className="w-full"
                      id={'pair-distance'}
                      min={-1}
                      name={'pair-distance'}
                      required
                      type="number"
                    />
                    <Select name="pair-distance-type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ANNOTATION_DISTANCE_TYPES.map((type) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
