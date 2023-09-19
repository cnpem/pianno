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
import dayjs from 'dayjs';
import { dataURItoBlob } from '@/lib/utils';
import { fileSave } from 'browser-fs-access';
import { BracesIcon, CheckIcon, CopyIcon, SaveIcon } from 'lucide-react';
import { FC, useState } from 'react';

interface SaveDialogProps {}

const SaveDialog: FC<SaveDialogProps> = ({}) => {
  const [device, setDevice] = useState('');
  const [name, setName] = useState('');
  const [geometry, setGeometry] = useState('');
  const [distance, setDistance] = useState('');
  const [copiedText, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const ready = device && name && geometry && distance;

  const label = useStoreLabel();

  const dataURItoJSON = (dataURI: string) => {
    const blob = dataURItoBlob(dataURI);
    const jsonData = {
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      pimega_name: `${device}#${name}`,
      geometry: geometry,
      distance: distance,
      image: blob,
    };

    return jsonData;
  };

  const handleSaveClick = () => {
    // Create your custom JSON data here
    const jsonData = dataURItoJSON(label);
    // Create a blob of the data
    const fileToSave = new Blob([JSON.stringify(jsonData)], {
      type: 'application/json',
    });
    // Save the file
    fileSave(fileToSave, {
      fileName: 'annot.json',
      extensions: ['.json'],
    });
  };

  const handleCopyClick = () => {
    // Create your custom JSON data here
    const jsonData = dataURItoJSON(label);
    // Save the file
    copy(JSON.stringify(jsonData)).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    });
  };

  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-2">
            <Select onValueChange={setDevice}>
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
                htmlFor="device-name"
                className=" font-semibold text-muted-foreground"
              >
                #
              </Label>
              <Input
                id="device-name"
                onChange={(e) => setName(e.target.value)}
                type="number"
                className="w-full"
                min={1}
                max={5}
              />
            </div>
            <Select onValueChange={setGeometry}>
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
              onChange={(e) => setDistance(e.target.value)}
              id="distance"
              type="number"
              min={0}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-4">
            {!isCopied ? (
              <Button
                variant="outline"
                onClick={handleCopyClick}
                disabled={!ready}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy to clipboard
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleCopyClick}
                disabled={!ready}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                Copied!
              </Button>
            )}
            <Button
              variant="default"
              onClick={handleSaveClick}
              disabled={!ready}
            >
              <BracesIcon className="mr-2 h-4 w-4" />
              Save JSON
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
