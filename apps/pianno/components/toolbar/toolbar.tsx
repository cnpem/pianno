'use client';

import {
  useStoreActions,
  useStoreImageMetadata,
  useStoreImg,
} from '@/hooks/use-store';
import { useTemporalStore } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { type VariantProps } from 'class-variance-authority';
import {
  AlertTriangleIcon,
  ImageIcon,
  MaximizeIcon,
  RedoIcon,
  UndoIcon,
} from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button, buttonVariants } from '../ui/button';
import OpenImageDialog from './open';
import Reset from './reset';
import SaveDialog from './save';
import TogglePairs from './toggle-pairs';
import Tools from './tools';

const ToolbarMessenger = () => {
  const { name } = useStoreImageMetadata();

  if (!name)
    return (
      <div className="fixed inset-x-0 top-20 z-10 text-center text-violet-300">
        <span className="flex-row items-center justify-center font-mono font-semibold">
          {'Please load an image to start '}
          <ImageIcon className="inline-block h-4 w-4 animate-pulse stroke-violet-800" />{' '}
        </span>
      </div>
    );

  return (
    <div className="fixed inset-x-0 top-20 z-10 text-center text-violet-300">
      <span className="flex-row items-center justify-center font-mono font-semibold">
        <AlertTriangleIcon className="inline-block h-4 w-4 animate-pulse stroke-yellow-700" />{' '}
        {'It looks like you were previously working with an image: '}
        <span className="font-bold text-blue-600 underline opacity-60">
          {name}
        </span>
        {'.'}
        <br />
        {
          'If you want to continue working on this image, please load it again.'
        }{' '}
        <AlertTriangleIcon className="inline-block h-4 w-4 animate-pulse stroke-yellow-700" />
      </span>
    </div>
  );
};

interface IToolbar {
  children: React.ReactNode;
  disabled?: boolean;
  hotkey?: string;
  onClick?: () => void;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

const Toolbar = () => {
  const { recenterViewport } = useStoreActions();
  const { futureStates, pastStates, redo, undo } = useTemporalStore(
    (state) => state,
  );
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;

  const [width, height] = useWindowSize();
  const img = useStoreImg();
  const canClick = img.src !== '#';

  useHotkeys(
    ['7', 'ctrl+z'],
    () => {
      undo();
    },
    { enabled: canUndo },
  );
  useHotkeys(
    ['8', 'ctrl+y'],
    () => {
      redo();
    },
    { enabled: canRedo },
  );
  useHotkeys(['9'], () => {
    recenterViewport(
      img.width ? img.width : width,
      img.height ? img.height : height,
    );
  });

  const actions: IToolbar[] = [
    {
      children: <UndoIcon className="h-4 w-4" />,
      disabled: !canUndo,
      hotkey: '7',
      onClick: () => {
        undo();
      },
      title: 'undo -- 7 or ctrl+z',
    },
    {
      children: <RedoIcon className="h-4 w-4" />,
      disabled: !canRedo,
      hotkey: '8',
      onClick: () => {
        redo();
      },
      title: 'redo -- 8 or ctrl+y',
    },
    {
      children: <MaximizeIcon className="h-4 w-4" />,
      hotkey: '9',
      onClick: () =>
        recenterViewport(
          img.width ? img.width : width,
          img.height ? img.height : height,
        ),
      title: 'fit-view -- 9',
    },
  ];

  return (
    <>
      <div className="fixed inset-y-0 right-4 my-auto flex h-fit rounded-lg bg-background p-1 opacity-95 shadow-lg md:hidden lg:hidden">
        <Tools />
      </div>
      <div className="fixed inset-x-0 top-4 mx-auto flex w-fit items-center gap-1 rounded-lg bg-background p-1 opacity-95 shadow-lg ">
        <div className="hidden md:block lg:block">
          <Tools />
        </div>
        <span className="hidden text-center text-input md:block lg:block">
          |
        </span>
        <OpenImageDialog />
        <SaveDialog disabled={!canClick} />
        <TogglePairs disabled={!canClick} />
        {actions.map((action) => (
          <Button
            className="group relative"
            disabled={action.disabled}
            key={action.title}
            onClick={action?.onClick}
            size={'icon'}
            title={action.title}
            variant={action.variant ?? 'outline'}
          >
            <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
              {action.hotkey}
            </p>
            {action.children}
          </Button>
        ))}
        <Reset />
      </div>
      {img.src === '#' && <ToolbarMessenger />}
    </>
  );
};

export default Toolbar;
