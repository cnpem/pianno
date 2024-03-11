'use client';

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnnotationPoints } from '@/hooks/use-annotation-points';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import {
  useStoreActions,
  useStoreToggled,
  useStoreViewport,
} from '@/hooks/use-store';
import { PIMEGA_DEVICES, PIMEGA_GEOMETRIES } from '@/lib/constants';
import { ANNOTATION_DISTANCE_TYPES } from '@/lib/constants';
import { Metadata } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileSave } from 'browser-fs-access';
import dayjs from 'dayjs';
import {
  BanIcon,
  BracesIcon,
  CheckIcon,
  CopyIcon,
  SaveIcon,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { FC, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { z } from 'zod';

interface SaveDialogProps {
  disabled?: boolean;
}

const SaveDialog: FC<SaveDialogProps> = ({ disabled }) => {
  const [open, setOpen] = useState(false);

  const { setBrushMode } = useStoreActions();
  const toggled = useStoreToggled();
  const { toggle: togglePairs } = useStoreActions();

  const { points: pairs } = useAnnotationPoints();
  const canSave =
    pairs.size > 0 &&
    !Array.from(pairs.values()).some((pair) => pair.length !== 2);

  useHotkeys(
    ['5'],
    () => {
      if (!toggled) {
        togglePairs();
      }
      setBrushMode('drag');
      setOpen(true);
    },
    { enabled: !disabled },
  );

  const handleOpenChange = () => {
    if (!open) {
      setBrushMode('drag');
    }
    if (!toggled) {
      togglePairs();
    }
    setOpen(!open);
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
              title={'save json -- 5'}
              variant={'outline'}
            >
              <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
                5
              </p>
              <SaveIcon className="h-4 w-4 group-hover:hidden group-hover:animate-out" />
              <BanIcon className="hidden h-4 w-4 scale-125 stroke-red-600 group-hover:block group-hover:animate-in" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{"Can't save!"}</AlertDialogTitle>
              <AlertDialogDescription>
                {pairs.size === 0 ? (
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
              title={'save json -- 5'}
              variant={'outline'}
            >
              <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
                5
              </p>
              <SaveIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="left-auto right-1 max-w-[350px] translate-x-0 opacity-95 lg:max-w-[425px]"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Save your Annotations</DialogTitle>
              <DialogDescription>
                Fill in the following fields with the annotation metadata. Click
                save or copy to clipboard when you are done.
              </DialogDescription>
            </DialogHeader>
            <hr />
            <SaveForm />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SaveDialog;

const formSchema = z.object({
  annotation: z.array(
    z.object({
      color: z.string(),
      pairDistance: z.coerce.number().min(-1).optional(),
      pairDistanceType: z.string().optional(),
    }),
  ),
  device: z.string(),
  deviceId: z.coerce.number().min(1).max(5),
  distance: z.coerce.number().min(0),
  geometry: z.string(),
});

const SaveForm = () => {
  const viewport = useStoreViewport();
  const { points } = useAnnotationPoints();
  const defaultAnnotation = useMemo(
    () =>
      Array.from(points.values()).map((pair) => ({
        color: pair[0].color,
        pairDistance: pair[0].distance || -2,
        pairDistanceType: pair[0].type,
      })),
    [points],
  );
  const [isCopied, setIsCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      annotation: defaultAnnotation,
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'annotation',
  });

  useEffect(() => {
    replace(defaultAnnotation);
  }, [defaultAnnotation, replace]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const metadata = formatMetadata(data);
    const fileToSave = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    fileSave(fileToSave, {
      extensions: ['.json'],
      fileName: `annot_${nanoid()}.json`,
    })
      .then(() => {
        toast.success('Annotations saved successfully!');
      })
      .catch((err) => {
        toast.error('Annotations could not be saved!');
      });
  };

  const onCopy = (data: z.infer<typeof formSchema>) => {
    const metadata = formatMetadata(data);
    copy(JSON.stringify(metadata))
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

  const snapToPair = (id: number) => {
    const pair = points.get(fields[id].color);
    if (!pair) return;
    const point = pair[0];
    viewport?.snap(point.x, point.y, {
      removeOnComplete: true,
    });
    viewport?.setZoom(5);
  };

  const formatMetadata = (data: z.infer<typeof formSchema>) => {
    const metadata: Metadata = {
      annotations: data.annotation.map((a) => ({
        distance: a.pairDistance || -1,
        points: points.get(a.color)?.map((p) => ({ x: p.x, y: p.y })) || [],
        type: a.pairDistanceType || 'euclidean',
      })),
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      device: {
        distance: data.distance,
        geometry: data.geometry,
        id: data.deviceId,
        name: data.device,
      },
    };
    return metadata;
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[65vh]">
          <FormField
            control={form.control}
            name="device"
            render={({ field }) => (
              <FormItem className="p-4">
                <FormLabel> Device</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
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
                </FormControl>
                <FormDescription>
                  Choose the pimega device used for the annotations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceId"
            render={({ field }) => (
              <FormItem className="p-4">
                <FormLabel> Device ID</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Enter the pimega device identifier from 1 to 5 referring to
                  the beamline.{' '}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="geometry"
            render={({ field }) => (
              <FormItem className="p-4">
                <FormLabel> Geometry</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
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
                </FormControl>
                <FormDescription>Choose the device geometry.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem className="p-4">
                <FormLabel> Distance</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Choose the distance for the measured image (in mm), can be 0
                  for planar devices.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="p-4 text-lg font-semibold text-muted-foreground">
            Annotations
          </span>
          <hr />
          <div className="flex items-center gap-1 p-4">
            <div className="flex flex-col gap-2">
              {
                // Pair distance fields
                fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`annotation.${index}.pairDistance`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance (pixels)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onFocus={() => snapToPair(index)}
                            style={{
                              backgroundImage: `linear-gradient(75deg,hsl(0deg 0% 100%) 1%,${fields[index].color})`,
                            }}
                            type="number"
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
            </div>
            <div className="flex flex-col gap-2">
              {
                // Pair distance type fields
                fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`annotation.${index}.pairDistanceType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="default">
            <BracesIcon className="mr-2 h-4 w-4" />
            Save JSON
          </Button>
          <Button
            onClick={form.handleSubmit(onCopy)}
            size="icon"
            variant="outline"
          >
            {isCopied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
