'use client';

import {
  useStoreActions,
  useStoreBrushParams,
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
    ['6', 'ctrl+z'],
    () => {
      undo();
    },
    { enabled: canUndo },
  );
  useHotkeys(
    ['7', 'ctrl+y'],
    () => {
      redo();
    },
    { enabled: canRedo },
  );
  useHotkeys(['8'], () => {
    recenterViewport(
      img.width ? img.width : width,
      img.height ? img.height : height,
    );
  });

  const actions: IToolbar[] = [
    {
      children: <UndoIcon className="h-4 w-4" />,
      disabled: !canUndo,
      hotkey: '6',
      onClick: () => {
        undo();
      },
      title: 'undo -- 6 or ctrl+z',
    },
    {
      children: <RedoIcon className="h-4 w-4" />,
      disabled: !canRedo,
      hotkey: '7',
      onClick: () => {
        redo();
      },
      title: 'redo -- 7 or ctrl+y',
    },
    {
      children: <MaximizeIcon className="h-4 w-4" />,
      hotkey: '8',
      onClick: () =>
        recenterViewport(
          img.width ? img.width : width,
          img.height ? img.height : height,
        ),
      title: 'fit-view -- 8',
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 top-4 z-10 mx-auto flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-background p-1 opacity-95 shadow-lg">
        <Tools />
        <span className="flex text-center text-input">|</span>
        <div className="flex flex-row gap-1">
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
      </div>
      {img.src === '#' && <ToolbarMessenger />}
    </>
  );
};

export default Toolbar;
