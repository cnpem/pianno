'use client';

import { exportAnnotation, getAnnotationGroup } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { AnnotationGroup, Metadata } from '@/lib/types';
import { fileSave } from 'browser-fs-access';
import {
  BanIcon,
  BracesIcon,
  CheckIcon,
  CopyIcon,
  MapPinIcon,
  SaveIcon,
  SearchIcon,
} from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { FC, useEffect, useReducer, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { PreviewCanvas } from '../canvas';
import { Toggle } from '../ui/toggle';

interface SaveDialogProps {
  disabled?: boolean;
}

const SaveDialog: FC<SaveDialogProps> = ({ disabled }) => {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [toggled, toggle] = useReducer((state) => !state, true);

  const colors = useStoreColors();
  const label = useStoreLabel();
  const viewport = useStoreViewport();

  const [pairs, setPairs] = useState<AnnotationGroup | null>(null);
  const forbidden =
    pairs && Object.values(pairs).some((pair) => pair.length !== 2);

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

  const handleSaveClick = (data: Metadata) => {
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

  const handleCopyClick = (data: Metadata) => {
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

  const typeFromColor = (color: string) => {
    if (colors.vertical.includes(color)) return 'vertical';
    if (colors.horizontal.includes(color)) return 'horizontal';
    if (colors.euclidean.includes(color)) return 'euclidean';
    return undefined;
  };

  return (
    <>
      {!!forbidden ? (
        <AlertDialog onOpenChange={setOpen} open={open}>
          <AlertDialogTrigger asChild>
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
              <SaveIcon className="h-4 w-4 group-hover:hidden group-hover:animate-out" />
              <BanIcon className="hidden h-4 w-4 scale-125 stroke-red-600 group-hover:block group-hover:animate-in" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{"Can't save!"}</AlertDialogTitle>
              <AlertDialogDescription>
                The annotations should be in pairs. Please check annotations
                with a{' '}
                <span className="inline font-bold text-violet-700">X</span>{' '}
                marker or single points surrounded by a circle and remove them
                before saving.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
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
                <div className="flex flex-row items-center gap-2">
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
                  <Label
                    className=" font-semibold text-muted-foreground"
                    htmlFor="device-id"
                  >
                    #
                  </Label>
                  <Input
                    className="w-full"
                    id="device-id"
                    max={5}
                    min={1}
                    name="device-id"
                    required
                    type="number"
                  />
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
                <div className="">
                  <PreviewCanvas toggled={toggled} />
                </div>
                <ScrollArea className="h-[350px]">
                  <div className="flex flex-col gap-2">
                    {Object.entries(pairs || {}).map(([color, value]) => (
                      <div
                        className={'flex flex-row items-center gap-2 p-2'}
                        key={color}
                      >
                        <Button
                          className="group rounded-full border px-3"
                          onClick={() => {
                            viewport?.snap(value[0].x, value[0].y, {
                              removeOnComplete: true,
                            });
                            viewport?.setZoom(2);
                          }}
                          size="icon"
                          style={{ borderColor: color }}
                          title="go to pair"
                          type="button"
                          variant={'outline'}
                        >
                          <MapPinIcon
                            className="hidden h-4 w-4 scale-125 group-focus:block group-focus:animate-in"
                            stroke={color}
                          />
                          <SearchIcon
                            className="h-4 w-4 scale-125 group-focus:hidden"
                            stroke={color}
                          />
                        </Button>
                        <Label
                          className="text-left text-xs font-semibold text-muted-foreground"
                          htmlFor={'pair-distance'}
                        >
                          Distance
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
                          defaultValue={typeFromColor(color)}
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
              <DialogFooter className="relative">
                <Toggle
                  aria-label="toggle pairs"
                  className="absolute left-0"
                  onPressedChange={toggle}
                  pressed={toggled}
                >
                  {toggled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Toggle>
                <div className="flex flex-row gap-4">
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
                  <Button
                    formAction={saveAction}
                    type="submit"
                    variant="default"
                  >
                    <BracesIcon className="mr-2 h-4 w-4" />
                    Save JSON
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SaveDialog;
