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
import { useStoreActions, useStoreImg } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { useTemporalStore } from '@/providers/store';
import { RotateCcwIcon } from 'lucide-react';
import { FC } from 'react';

import { Button, buttonVariants } from '../ui/button';

interface ResetProps {}

const Reset: FC<ResetProps> = ({}) => {
  const { recenterViewport, reset, softReset } = useStoreActions();
  const img = useStoreImg();
  const { clear } = useTemporalStore((state) => state);
  const [width, height] = useWindowSize();
  const handleClean = () => {
    softReset();
    clear();
    recenterViewport(img.width, img.height);
  };
  const handleReset = () => {
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
          <AlertDialogAction disabled={img.src === '#'} onClick={handleClean}>
            Clear Canvas
          </AlertDialogAction>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleReset}
          >
            Clear Everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Reset;
