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
import { fileSave } from 'browser-fs-access';
import {
  BracesIcon,
  BracketsIcon,
  ClipboardIcon,
  CopyIcon,
  PaperclipIcon,
  SaveIcon,
} from 'lucide-react';
import { FC } from 'react';

interface SaveDialogProps {}

const SaveDialog: FC<SaveDialogProps> = ({}) => {
    const handleSaveClick = () => {
        // Create your custom JSON data here
        const jsonData = {
            name: 'Pedro Duarte',
            username: '@peduarte',
            };
        // Create a blob of the data
        const fileToSave = new Blob([JSON.stringify(jsonData)], {
            type: 'application/json',
        });
        // Save the file
        fileSave(fileToSave, {
            fileName: 'profile.json',
            extensions: ['.json'],
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-2">
            <Button variant="outline">
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy to clipboard
            </Button>
            <Button variant="default"
            onClick={handleSaveClick}
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
