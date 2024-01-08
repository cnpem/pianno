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
  useStoreActions,
  useStoreColors,
  useStoreLabel,
  useStoreToggled,
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
import { FC, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

interface SaveDialogProps {
  disabled?: boolean;
}

const SaveDialog: FC<SaveDialogProps> = ({ disabled }) => {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const colors = useStoreColors();
  const label = useStoreLabel();
  const viewport = useStoreViewport();
  const { setBrushMode } = useStoreActions();
  const toggled = useStoreToggled();
  const { toggle: togglePairs } = useStoreActions();

  const [pairs, setPairs] = useState<AnnotationGroup>({});
  const canSave =
    Object.values(pairs).length > 0 &&
    !Object.values(pairs).some((pair) => pair.length !== 2);

  useEffect(() => {
    getAnnotationGroup(label).then((res) => {
      setPairs(res);
    });
  }, [label]);

  useHotkeys(
    ['4'],
    () => {
      if (!toggled) {
        togglePairs();
      }
      setBrushMode(undefined);
      setOpen(true);
    },
    { enabled: !disabled },
  );

  const handleOpenChange = () => {
    if (!open) {
      setBrushMode(undefined);
    } else {
      setBrushMode('pen');
    }
    if (!toggled) {
      togglePairs();
    }
    setOpen(!open);
  };

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
        setOpen(false);
        toast.success('Annotations saved successfully!');
      })
      .catch((err) => {
        toast.error('Annotations could not be saved!');
      });
  };

  const handleCopyClick = (data: Metadata) => {
    // Save the file
    copy(JSON.stringify(data))
      .then(() => {
        setIsCopied(true);
        toast.success('Annotations copied to clipboard!');
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error('Annotations could not be copied!');
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

  const typeFromColor = (color: string) => {
    if (colors.vertical.includes(color)) return 'vertical';
    if (colors.horizontal.includes(color)) return 'horizontal';
    if (colors.euclidean.includes(color)) return 'euclidean';
    return undefined;
  };

  return (
    <>
      {!canSave ? (
        <AlertDialog onOpenChange={handleOpenChange} open={open}>
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
                {Object.values(pairs).length === 0 ? (
                  <>
                    You need to annotate at least one pair of points before
                    saving.
                  </>
                ) : (
                  <>
                    The annotations should be in pairs. Please check annotations
                    with a{' '}
                    <span className="inline font-bold text-violet-700">X</span>{' '}
                    marker or single points surrounded by a circle and remove
                    them before saving.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Dialog modal={false} onOpenChange={handleOpenChange} open={open}>
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
          <DialogContent
            className="left-auto right-1 translate-x-0 opacity-95 sm:max-w-[350px]"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Save your Annotations</DialogTitle>
              <DialogDescription>
                Fill in the following fields with the annotation metadata. Click
                save or copy to clipboard when you are done.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center gap-2">
                <div className="relative">
                  <Label
                    className="absolute left-2 top-1 z-10 -translate-y-2 scale-75 text-sm font-semibold text-muted-foreground"
                    htmlFor="device"
                  >
                    Device
                  </Label>
                  <Select name="device" required>
                    <SelectTrigger id="device">
                      <SelectValue />
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
                </div>
                <div className="relative">
                  <Label
                    className="absolute left-2 top-1 z-10 -translate-y-2 scale-75 text-sm font-semibold text-muted-foreground"
                    htmlFor="device-id"
                  >
                    #
                  </Label>
                  <Input
                    className="peer"
                    id="device-id"
                    max={5}
                    min={1}
                    name="device-id"
                    required
                    type="number"
                  />
                </div>
                <div className="relative">
                  <Label
                    className="absolute left-2 top-1 z-10 -translate-y-2 scale-75 text-sm font-semibold text-muted-foreground"
                    htmlFor="geometry"
                  >
                    Geometry
                  </Label>
                  <Select name="geometry" required>
                    <SelectTrigger id="geometry">
                      <SelectValue />
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
                <div className="relative">
                  <Label
                    className="absolute top-1 z-10 -translate-y-2 scale-75 text-sm text-muted-foreground"
                    htmlFor="distance"
                  >
                    Distance <span className="font-light">(mm)</span>
                  </Label>
                  <Input
                    className="peer"
                    id="distance"
                    min={0}
                    name="distance"
                    required
                    type="number"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2"></div>

              <div className="">
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
                            viewport?.setZoom(5);
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
                        <div className="relative">
                          <Label
                            className="absolute left-2 top-1 z-10 -translate-y-2 scale-75 text-sm font-semibold text-muted-foreground"
                            htmlFor={color}
                          >
                            Distance{' '}
                            <span className="font-light">(pixels)</span>
                          </Label>
                          <Input
                            className="w-full"
                            id={color}
                            min={-1}
                            name={'pair-distance'}
                            required
                            type="number"
                          />
                        </div>
                        <div className="relative">
                          <Label
                            className="absolute left-2 top-1 z-10 -translate-y-2 scale-75 text-sm font-semibold text-muted-foreground"
                            htmlFor={(value[0].x + value[0].y).toString()}
                          >
                            Type
                          </Label>
                          <Select
                            defaultValue={typeFromColor(color)}
                            name="pair-distance-type"
                            required
                          >
                            <SelectTrigger
                              className="w-24"
                              id={(value[0].x + value[0].y).toString()}
                            >
                              <SelectValue />
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter className="relative">
                <div className="flex flex-row gap-4">
                  {!isCopied ? (
                    <Button
                      className="text-xs"
                      formAction={copyAction}
                      type="submit"
                      variant="outline"
                    >
                      <CopyIcon className="mr-2 h-4 w-4" />
                      Copy to clipboard
                    </Button>
                  ) : (
                    <Button className="text-xs" variant="outline">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Copied!
                    </Button>
                  )}
                  <Button
                    className="text-xs"
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
