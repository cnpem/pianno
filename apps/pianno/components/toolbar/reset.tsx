import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useStoreActions, useTemporalStore } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { RotateCcwIcon } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../ui/button';

interface ResetProps {}

const Reset: FC<ResetProps> = ({}) => {
  const { recenterViewport, reset } = useStoreActions();
  const { clear } = useTemporalStore((state) => state);
  const [width, height] = useWindowSize();
  const onContinue = () => {
    reset();
    clear();
    recenterViewport(width, height);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" title="reset" variant="destructive">
          <RotateCcwIcon className="h-4 w-4 hover:animate-reverse-spin" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            annotations and reset your canvas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Reset;
