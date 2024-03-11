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
import { Trash2Icon } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../ui/button';

interface ClearCanvasProps {}

const ClearCanvas: FC<ClearCanvasProps> = ({}) => {
  const { softReset } = useStoreActions();
  const { clear } = useTemporalStore((state) => state);
  const onContinue = () => {
    softReset();
    clear();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" title="clear canvas" variant="outline">
          <Trash2Icon className="h-4 w-4" />
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

export default ClearCanvas;
