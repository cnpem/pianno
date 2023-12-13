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
import {
  BracesIcon,
  CheckIcon,
  CopyIcon,
  MapPinIcon,
  SaveIcon,
  SearchIcon,
} from 'lucide-react';
import { type FC, useReducer, useRef } from 'react';

const PIMEGA_DEVICES = ['pi135D', 'pi450D', 'pi540D'];

const PIMEGA_GEOMETRIES = ['planar', 'nonplanar', 'arc', 'tower'];

const ANNOTATION_DISTANCE_TYPES = ['euclidean', 'horizontal', 'vertical'];

const pairs = {
  '#e57373': [
    {
      color: '#e57373',
      x: 0,
      y: 0,
      distance: -1,
      type: 'vertical',
    },
    {
      color: '#e57373',
      x: 10,
      y: 10,
      distance: -1,
      type: 'vertical',
    },
  ],
  '#42a5f5': [
    {
      color: '#42a5f5',
      x: 120,
      y: 192,
      distance: -1,
      type: 'horizontal',
    },
    {
      color: '#42a5f5',
      x: 110,
      y: 210,
      distance: -1,
      type: 'horizontal',
    },
  ],
  '#4caf50': [
    {
      color: '#4caf50',
      x: 20,
      y: 120,
      distance: 55,
      type: 'euclidean',
    },
    {
      color: '#4caf50',
      x: 110,
      y: 120,
      distance: 55,
      type: 'euclidean',
    },
  ],
};

interface SaveDialogProps {}

const SaveDialog: FC<SaveDialogProps> = ({}) => {
  const [open, toggleOpen] = useReducer((state) => !state, false);
  const [isCopied, toggleCopied] = useReducer((state) => !state, false);
  const handleCopy = () => {
    if (ref.current && ref.current.reportValidity()) {
      toggleCopied();
      setTimeout(() => toggleCopied(), 2000);
    }
  };
  const ref = useRef<HTMLFormElement>(null);

  return (
    <Dialog onOpenChange={toggleOpen} open={open}>
      <DialogTrigger asChild>
        <Button size={'icon'} title={'save json'} variant={'outline'}>
          <SaveIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Save your Annotations</DialogTitle>
          <DialogDescription>
            Fill in the following fields with the annotation metadata. Click
            save or copy to clipboard when you are done.
          </DialogDescription>
        </DialogHeader>
        <form ref={ref}>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2 md:flex md:flex-row">
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
                className="text-right font-semibold text-muted-foreground"
                htmlFor="device-hash"
              >
                #
              </Label>
              <Input
                id="device-hash"
                max={5}
                min={1}
                name="device-hash"
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
                className="text-right text-xs font-semibold text-muted-foreground"
                htmlFor="distance"
              >
                Distance <span className="font-light">(mm)</span>
              </Label>
              <Input
                id="distance"
                min={0}
                name="distance"
                required
                type="number"
              />
            </div>
          </div>
          <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row">
            <div className="h-[10vh] w-full animate-pulse rounded-md border border-input bg-accent md:h-[20vh] md:w-[20vw]"></div>
            <div className="h-[200px]">
              <div className="flex flex-col gap-2">
                {Object.entries(pairs || {}).map(([color, value]) => (
                  <div
                    className={'flex flex-row items-center gap-2 p-2'}
                    key={color}
                  >
                    <Button
                      className="group rounded-full border px-3"
                      onClick={() =>
                        alert(
                          `snap to pair (${value[0].x} ${value[0].y}) - (${value[1].x} ${value[1].y})`,
                        )
                      }
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
                      id={'pair-distance'}
                      min={-1}
                      name={'pair-distance'}
                      required
                      type="number"
                    />
                    <Select
                      defaultValue={value[0].type}
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
            </div>
          </div>
          <DialogFooter className="relative">
            <div className="flex flex-row gap-4">
              {!isCopied ? (
                <Button onClick={handleCopy} variant="outline">
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>
              ) : (
                <Button variant="outline">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied!
                </Button>
              )}
              <Button type="submit" variant="default">
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
