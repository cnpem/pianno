import { useStoreImg } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { CornerRightDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { useReducer } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button, buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface HelpProps {}

const Help: FC<HelpProps> = ({}) => {
  const [open, toggleOpen] = useReducer((s) => !s, false);
  const { src } = useStoreImg();
  useHotkeys('h', () => toggleOpen());
  return (
    <Dialog onOpenChange={toggleOpen} open={open}>
      {src === '#' && (
        <div className="fixed bottom-12 right-4 z-10 text-center text-violet-300">
          <span className="items-center justify-center font-mono font-semibold">
            if you need help{' '}
            <CornerRightDown className="inline-block h-4 w-4 animate-pulse stroke-violet-800" />{' '}
          </span>
        </div>
      )}
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-1 right-1 z-10 opacity-90 shadow-lg"
          size="icon"
          title="help"
          variant="outline"
        >
          ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-start justify-between gap-1">
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), '')}
              href="https://pianno.lnls.br/uwu"
              rel="noopener noreferrer"
              target="_blank"
              title="help"
            >
              Documentation
              <ExternalLink className="ml-1" size={16} />
            </Link>
            <p className="mt-1 text-xl text-input"> | </p>
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), '')}
              href="https://github.com/cnpem/pianno/issues"
              rel="noopener noreferrer"
              target="_blank"
              title="help"
            >
              Report an issue
              <ExternalLink className="ml-1" size={16} />
            </Link>
          </div>
          <p className="text-sm font-semibold">Keyboard shortcuts</p>
          <div className="flex flex-col gap-2 rounded-md border border-input p-2">
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Zoom</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  Scroll
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  Pinch
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Pen</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  1
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  p
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Eraser</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  2
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  e
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Drag</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  3
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  d
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Load Image</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  4
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Save Annotations</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  5
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Toggle pairs view</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  6
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Undo</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  7
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  Ctrl
                </kbd>
                <p className="text-xs">+</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  z
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Redo</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  8
                </kbd>
                <p className="text-xs">or</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  Ctrl
                </kbd>
                <p className="text-xs">+</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  y
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Fit view</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  9
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Eraser size</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  up
                </kbd>
                <p className="text-xs">/</p>
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  down
                </kbd>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-sm">Help</p>
              <div className="flex flex-row items-center gap-1">
                <kbd className="rounded-sm bg-violet-200 px-2 py-1 text-xs">
                  H
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Help;
