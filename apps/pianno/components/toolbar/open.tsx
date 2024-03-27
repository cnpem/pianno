'use client';

import { openImage } from '@/app/actions';
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
import { Switch } from '@/components/ui/switch';
import { useStoreActions, useStoreImageMetadata } from '@/hooks/use-store';
import { RAW_DATA_TYPES } from '@/lib/constants';
import { openImageSchema } from '@/lib/types';
import { fileOpen } from 'browser-fs-access';
import { ImageIcon } from 'lucide-react';
import { FC, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface OpenImageDialogProps {}

const OpenImageDialog: FC<OpenImageDialogProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const imgMetadata = useStoreImageMetadata();

  const { setImage, setImageMetadata, softReset } = useStoreActions();

  useHotkeys(['4'], () => {
    setOpen(true);
  });

  function rescaleToUInt8(data: number[]) {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (value > max) {
        max = value;
      }
    }
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const normalizedValue = value / max;
      const scaledValue = normalizedValue * 255;
      const uint8Value = Math.round(scaledValue);
      data[i] = uint8Value;
    }
    return data;
  }
  const convertArraytoDataURL = (
    arr: number[],
    width: number,
    height: number,
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      const offset = i * 4;
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL();
    // canvas.remove();
    return dataURL;
  };

  const reset = (metadata: typeof imgMetadata) => {
    //compare metadata w current metadata and reset if different or if current is empty
    if (
      metadata.name !== imgMetadata.name ||
      metadata.size !== imgMetadata.size ||
      metadata.type !== imgMetadata.type ||
      !imgMetadata.name
    ) {
      softReset();
    }
  };

  const handleLoadImage = (data: z.infer<typeof openImageSchema>) => {
    if (data.checked) {
      fileOpen({
        extensions: ['.raw', '.b', '.bin'],
        mimeTypes: ['application/octet-stream'],
      })
        .then((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            let typedArray;
            switch (data.dtype) {
              case 'float64':
                typedArray = Float64Array;
                break;
              case 'float32':
                typedArray = Float32Array;
                break;
              case 'int32':
                typedArray = Int32Array;
                break;
              default:
                typedArray = Float64Array;
                break;
            }
            const arr = Array.from(new typedArray(arrayBuffer));
            const uint8Array = rescaleToUInt8(arr);
            const url = convertArraytoDataURL(
              uint8Array,
              data.width!,
              data.height!,
            );

            const metadata = {
              name: file.name,
              size: file.size,
              type: file.type,
            };
            reset(metadata);
            setImageMetadata(metadata);
            setImage({
              height: data.height!,
              src: url!,
              width: data.width!,
            });
            toast.success('Image loaded.');
          };
          reader.readAsArrayBuffer(file);
        })
        .catch(() => {
          toast.error('Error loading image.');
        });
    } else {
      fileOpen({
        extensions: ['.png', '.jpg', '.jpeg', '.gif'],
        mimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      })
        .then((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const metadata = {
                name: file.name,
                size: file.size,
                type: file.type,
              };
              reset(metadata);
              setImageMetadata(metadata);
              setImage({
                height: img.height,
                src: URL.createObjectURL(file),
                width: img.width,
              });
              toast.success('Image loaded.');
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        })
        .catch(() => {
          toast.error('Error loading image.');
        });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setChecked(false);
    }
  };

  function submitAction(data: FormData) {
    formRef.current?.reset();
    openImage(data)
      .then((res) => {
        handleLoadImage(res);
        handleOpenChange(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          className="group relative"
          size={'icon'}
          title={'load image -- 4'}
          variant={'outline'}
        >
          <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
            4
          </p>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load new image</DialogTitle>
          <DialogDescription>
            {checked
              ? 'Fill in raw image metadata and click load.'
              : 'Click load.'}
          </DialogDescription>
        </DialogHeader>
        <form action={submitAction} ref={formRef}>
          <div className="flex flex-row items-center gap-2 text-center">
            <span className="font-mono font-semibold">PNG</span>
            <Switch
              checked={checked}
              name="checked"
              onCheckedChange={setChecked}
            />
            <span className="font-mono font-semibold">RAW</span>
          </div>
          {checked && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Label htmlFor="width">Width</Label>
              <Label htmlFor="height">Height</Label>
              <Label htmlFor="dtype">Data type</Label>
              <Input id="width" min={1} name="width" required type="number" />
              <Input id="height" min={1} name="height" required type="number" />
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
};

export default OpenImageDialog;
