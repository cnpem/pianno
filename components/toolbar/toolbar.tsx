'use client';

import {
  useStoreActions,
  useStoreBrushMode,
  useStoreImg,
} from '@/hooks/use-store';
import { useTemporalStore } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { type BrushMode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import {
  DownloadIcon,
  EraserIcon,
  ImageIcon,
  MaximizeIcon,
  PenIcon,
  RedoIcon,
  RotateCcwIcon,
  UndoIcon,
} from 'lucide-react';

import { Button, buttonVariants } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import SaveDialog from './save';

interface IToolbar {
  title: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  disabled?: boolean;
  onClick?: () => void;
}

const ToolItem = ({ title, children }: IToolbar) => {
  return (
    <Label
      htmlFor={title}
      title={title}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input bg-popover hover:bg-accent peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-400 peer-data-[state=checked]:[&>svg]:fill-violet-500 peer-data-[state=checked]:[&>svg]:stroke-violet-700"
    >
      {children}
    </Label>
  );
};

const tools: IToolbar[] = [
  {
    title: 'pen',
    children: <PenIcon className="h-4 w-4" />,
  },
  {
    title: 'eraser',
    children: <EraserIcon className="h-4 w-4" />,
  },
];

const OpenImageButton = () => {
  const { setImage } = useStoreActions();

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const objectUrl = URL.createObjectURL(event.target.files[0]);
      const reader = new FileReader();
      let dataUrl: string | ArrayBuffer | null;
      reader.onload = () => {
        dataUrl = reader.result;
      };
      // convert image src to base64 dataUrl to persist it in store
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      const img = new Image();
      img.src = objectUrl;
      img.onload = () => {
        setImage({
          src: dataUrl as string,
          width: img.width,
          height: img.height,
        });
      };
    }
  };

  return (
    <div>
      <input
        onChange={onImageChange}
        type="file"
        accept="image/*"
        id="img"
        hidden
      />
      <label
        htmlFor={'img'}
        title="open image"
        aria-label="open image"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'cursor-pointer',
        )}
      >
        <ImageIcon className="h-4 w-4" />
      </label>
    </div>
  );
};

const Toolbar = () => {
  const brushMode = useStoreBrushMode();
  const { setBrushMode, recenterViewport, reset } = useStoreActions();
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state,
  );
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;

  const [width, height] = useWindowSize();
  const img = useStoreImg();

  const actions: IToolbar[] = [
    {
      title: 'undo',
      children: <UndoIcon className="h-4 w-4" />,
      disabled: !canUndo,
      onClick: () => {
        undo();
      },
    },
    {
      title: 'redo',
      children: <RedoIcon className="h-4 w-4" />,
      disabled: !canRedo,
      onClick: () => {
        redo();
      },
    },
    {
      title: 'fit-view',
      children: <MaximizeIcon className="h-4 w-4" />,
      onClick: () =>
        recenterViewport(
          img.width ? img.width : width,
          img.height ? img.height : height,
        ),
    },
    {
      title: 'reset',
      children: (
        <RotateCcwIcon className="h-4 w-4 hover:animate-reverse-spin" />
      ),
      variant: 'destructive',
      onClick: () => {
        reset();
        recenterViewport(width, height);
      },
    },
  ];

  const onBrushChange = (brush: BrushMode) => {
    setBrushMode(brush);
  };

  return (
    <div className="fixed inset-x-0 top-4 z-10 mx-auto flex w-[380px] max-w-2xl flex-row items-center justify-center gap-2 rounded-lg bg-background p-1 opacity-95 shadow-lg">
      <RadioGroup
        onValueChange={(brush) => onBrushChange(brush as BrushMode)}
        value={brushMode}
        className="flex flex-row gap-1"
      >
        {tools.map((tool) => (
          <div key={tool.title}>
            <RadioGroupItem
              value={tool.title}
              id={tool.title}
              className="peer sr-only"
            />
            <ToolItem title={tool.title}>{tool.children}</ToolItem>
          </div>
        ))}
      </RadioGroup>
      <span className="flex text-center text-input">|</span>
      <div className="flex flex-row gap-1">
        <OpenImageButton />
        <SaveDialog />
        {actions.map((action) => (
          <Button
            key={action.title}
            title={action.title}
            variant={action.variant ?? 'outline'}
            size={'icon'}
            disabled={action.disabled}
            onClick={action?.onClick}
          >
            {action.children}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
