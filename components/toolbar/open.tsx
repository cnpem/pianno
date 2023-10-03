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
import { useTemporalStore } from '@/hooks/use-store';
import { useStoreActions } from '@/hooks/use-store';
import { openImageSchema } from '@/lib/types';
import { fileOpen } from 'browser-fs-access';
import { ImageIcon } from 'lucide-react';
import { FC, useRef, useState } from 'react';
import { z } from 'zod';

interface OpenImageDialogProps {}

const OpenImageDialog: FC<OpenImageDialogProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const { clear } = useTemporalStore((state) => state);
  const formRef = useRef<HTMLFormElement>(null);

  const { setImage, resetLabel } = useStoreActions();

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
    canvas.remove();
    return dataURL;
  };

  const handleLoadImage = (data: z.infer<typeof openImageSchema>) => {
    if (data.checked) {
      fileOpen({
        mimeTypes: ['application/octet-stream'],
        extensions: ['.raw', '.b', '.bin'],
      })
        .then((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            // TODO: should include dtype?
            const floatArr = new Float64Array(arrayBuffer);
            const arr = Array.from(floatArr);
            const uint8Array = rescaleToUInt8(arr);
            const url = convertArraytoDataURL(
              uint8Array,
              data.width!,
              data.height!,
            );
            setImage({
              width: data.width!,
              height: data.height!,
              src: url!,
            });
            resetLabel();
            clear();
          };
          reader.readAsArrayBuffer(file);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fileOpen({
        mimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        extensions: ['.png', '.jpg', '.jpeg', '.gif'],
      })
        .then((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              setImage({
                width: img.width,
                height: img.height,
                src: e.target?.result as string,
              });
              // soft reset on image load
              resetLabel();
              clear();
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setChecked(false);
    }
  };

  async function submitAction(data: FormData) {
    formRef.current?.reset();
    const res = await openImage(data);
    handleLoadImage(res);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button title={'load image'} variant={'outline'} size={'icon'}>
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
              name="checked"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <span className="font-mono font-semibold">RAW</span>
          </div>
          {checked && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Label htmlFor="width">Width</Label>
              <Label htmlFor="height">Height</Label>
              <Input
                id="width"
                name="width"
                type="number"
                min={1}
                max={4096}
                required
              />
              <Input
                id="height"
                name="height"
                type="number"
                min={1}
                max={4096}
                required
              />
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
