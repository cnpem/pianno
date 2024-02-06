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
import { BanIcon, SaveIcon } from 'lucide-react';

import { type FC } from 'react';

interface SaveAlertDialogProps {}

const SaveAlertDialog: FC<SaveAlertDialogProps> = ({}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="group relative" size={'icon'} variant={'outline'}>
          <SaveIcon className="absolute h-4 w-4 group-hover:sr-only group-hover:animate-out" />
          <BanIcon className="collapse h-4 w-4 -translate-y-3 scale-125 group-hover:visible group-hover:stroke-red-600 group-hover:animate-in" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{"Can't save!"}</AlertDialogTitle>
          <AlertDialogDescription>
            The annotations should be in pairs. Please check annotations with a{' '}
            <span className="inline font-bold text-violet-700 dark:text-violet-400">
              X
            </span>{' '}
            marker or single points surrounded by a{' '}
            <span className="inline font-bold italic text-violet-700 dark:text-violet-400">
              circle
            </span>{' '}
            and remove them before saving.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go back</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SaveAlertDialog;
