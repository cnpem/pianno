'use client';

import { exportAnnotation, getAnnotationGroup } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {
  useStoreColors,
  useStoreLabel,
  useStoreViewport,
} from '@/hooks/use-store';
import { PIMEGA_DEVICES, PIMEGA_GEOMETRIES } from '@/lib/constants';
import { ANNOTATION_DISTANCE_TYPES } from '@/lib/constants';
import { AnnotationGroup, annotationSchema } from '@/lib/types';
import { fileSave } from 'browser-fs-access';
import { BracesIcon, CheckIcon, CopyIcon, SaveIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { FC, useEffect, useReducer, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { z } from 'zod';

import { PreviewCanvas } from '../canvas';
import { Toggle } from '../ui/toggle';

type alertMessage = {
  callback: () => void;
  description: string;
  title: string;
};

interface SaveDialogProps {
  disabled?: boolean;
}

const SaveDialog: FC<SaveDialogProps> = ({ disabled }) => {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [toggled, toggle] = useReducer((state) => !state, true);
  const [alert, setAlert] = useState<alertMessage | null>(null);

  const colors = useStoreColors();
  const label = useStoreLabel();
  const viewport = useStoreViewport();

  const [pairs, setPairs] = useState<AnnotationGroup | null>(null);

  useEffect(() => {
    getAnnotationGroup(label).then((res) => {
      setPairs(res);
    });
  }, [label]);

  useHotkeys(['4'], () => {
    if (!disabled) {
      handleOpenChange(true);
    }
  });

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
    // check if there are pairs with size > 2
    const forbidden =
      pairs && Object.values(pairs).some((pair) => pair.length !== 2);
    if (forbidden) {
      setAlert({
        callback: () => {
          setOpen(false);
          setAlert(null);
        },
        description:
          'The annotations should be in pairs. Please check annotations with a X marker or single points surrounded by a circle and remove them before saving.',
        title: "Can't save!",
      });
    }
    setOpen(open);
    if (!open) {
      window.location.reload();
      setAlert(null);
    }
  }

  const typeFromColor = (color: string) => {
    if (colors.vertical.includes(color)) return 'vertical';
    if (colors.horizontal.includes(color)) return 'horizontal';
    if (colors.euclidean.includes(color)) return 'euclidean';
    return undefined;
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          className="group relative"
          disabled={disabled}
          size={'icon'}
          title={'save json -- 4'}
          variant={'outline'}
        >
          <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
            4
          </p>
          <SaveIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <AlertDialog open={open && !!alert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alert?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                alert?.callback ? alert.callback() : setAlert(null);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!alert && (
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
                <PreviewCanvas toggled={toggled} />
              </div>
              <ScrollArea className="h-[200px] border-2 border-purple-800">
                <div className="flex flex-col gap-2">
                  {Object.entries(pairs || {}).map(([key, value], index) => (
                    <div
                      className={
                        'flex flex-row items-center gap-2 rounded-md p-2'
                      }
                      key={key}
                    >
                      <Button
                        onClick={() => {
                          viewport?.snap(value[0].x, value[0].y, {
                            removeOnComplete: true,
                          });
                          viewport?.setZoom(2);
                        }}
                        style={{ backgroundColor: key }}
                        type="button"
                        variant={'default'}
                      >
                        {index}
                      </Button>
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
                      <Select
                        defaultValue={typeFromColor(key)}
                        name="pair-distance-type"
                        required
                      >
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
                <Toggle
                  aria-label="toggle pairs"
                  onPressedChange={toggle}
                  pressed={toggled}
                >
                  {toggled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Toggle>
                {!isCopied ? (
                  <Button
                    formAction={copyAction}
                    type="submit"
                    variant="outline"
                  >
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
      )}
    </Dialog>
  );
};

export default SaveDialog;
