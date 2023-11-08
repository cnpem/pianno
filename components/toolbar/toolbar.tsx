'use client';

import { useStoreActions, useStoreImg } from '@/hooks/use-store';
import { useTemporalStore } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { type VariantProps } from 'class-variance-authority';
import {
  ImageIcon,
  MaximizeIcon,
  RedoIcon,
  RotateCcwIcon,
  UndoIcon,
} from 'lucide-react';

import { Button, buttonVariants } from '../ui/button';
import OpenImageDialog from './open';
import SaveDialog from './save';
import TogglePairs from './toggle-pairs';
import Tools from './tools';

interface IToolbar {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

const Toolbar = () => {
  const { recenterViewport, reset } = useStoreActions();
  const { clear, futureStates, pastStates, redo, undo } = useTemporalStore(
    (state) => state,
  );
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;

  const [width, height] = useWindowSize();
  const img = useStoreImg();
  const canClick = img.src !== '#';

  const actions: IToolbar[] = [
    {
      children: <UndoIcon className="h-4 w-4" />,
      disabled: !canUndo,
      onClick: () => {
        undo();
      },
      title: 'undo',
    },
    {
      children: <RedoIcon className="h-4 w-4" />,
      disabled: !canRedo,
      onClick: () => {
        redo();
      },
      title: 'redo',
    },
    {
      children: <MaximizeIcon className="h-4 w-4" />,
      onClick: () =>
        recenterViewport(
          img.width ? img.width : width,
          img.height ? img.height : height,
        ),
      title: 'fit-view',
    },
    {
      children: (
        <RotateCcwIcon className="h-4 w-4 hover:animate-reverse-spin" />
      ),
      onClick: () => {
        reset();
        clear();
        recenterViewport(width, height);
      },
      title: 'reset',
      variant: 'destructive',
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 top-4 z-10 mx-auto flex w-[420px] max-w-2xl flex-row items-center justify-center gap-2 rounded-lg bg-background p-1 opacity-95 shadow-lg">
        <Tools />
        <span className="flex text-center text-input">|</span>
        <div className="flex flex-row gap-1">
          <OpenImageDialog />
          <SaveDialog disabled={!canClick} />
          <TogglePairs disabled={!canClick} />
          {actions.map((action) => (
            <Button
              disabled={action.disabled}
              key={action.title}
              onClick={action?.onClick}
              size={'icon'}
              title={action.title}
              variant={action.variant ?? 'outline'}
            >
              {action.children}
            </Button>
          ))}
        </div>
      </div>
      {
        // show message if no image is loaded
        img.src === '#' && (
          <div className="fixed inset-x-0 top-20 z-10 text-center text-input">
            <span className="items-center justify-center font-mono font-semibold">
              Please load an image to start{' '}
              <ImageIcon className="inline h-4 w-4 stroke-purple-800" />{' '}
            </span>
          </div>
        )
      }
    </>
  );
};

export default Toolbar;
