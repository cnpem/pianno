"use client";

import {
  DownloadIcon,
  EraserIcon,
  GrabIcon,
  PenIcon,
  UndoIcon,
  RedoIcon,
  MaximizeIcon,
  ImageIcon,
  RotateCcwIcon,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button, buttonVariants } from "./ui/button";
import {
  type BrushMode,
  useStoreActions,
  useStoreBrushMode,
  useStoreImg,
} from "@/hooks/use-store";
import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

interface IToolbar {
  title: string;
  children: React.ReactNode;
  variant?: "outline" | "default" | "destructive" | "ghost";
  action?: () => void;
}

const ToolItem = ({ title, children }: IToolbar) => {
  return (
    <Label
      htmlFor={title}
      title={title}
      className="cursor-pointer flex items-center justify-center rounded-md border border-input bg-popover h-10 w-10 hover:bg-accent peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-400 peer-data-[state=checked]:[&>svg]:fill-violet-500 peer-data-[state=checked]:[&>svg]:stroke-violet-700"
    >
      {children}
    </Label>
  );
};

const tools: IToolbar[] = [
  {
    title: "pen",
    children: <PenIcon className="h-4 w-4" />,
  },
  {
    title: "eraser",
    children: <EraserIcon className="h-4 w-4" />,
  },
  {
    title: "grab",
    children: <GrabIcon className="h-4 w-4" />,
  },
];

const OpenImage = () => {
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
        htmlFor={"img"}
        title="open image"
        aria-label="open image"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "cursor-pointer"
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
  const [width, height] = useWindowSize();
  const img = useStoreImg();

  const actions: IToolbar[] = [
    {
      title: "undo",
      children: <UndoIcon className="h-4 w-4" />,
    },
    {
      title: "redo",
      children: <RedoIcon className="h-4 w-4" />,
    },
    {
      title: "save",
      children: <DownloadIcon className="h-4 w-4" />,
    },
    {
      title: "fit-view",
      children: <MaximizeIcon className="h-4 w-4" />,
      action: () =>
        recenterViewport(
          img.width ? img.width : width,
          img.height ? img.height : height
        ),
    },
    {
      title: "reset",
      children: (
        <RotateCcwIcon className="h-4 w-4 hover:animate-reverse-spin" />
      ),
      variant: "destructive",
      action: () => {
        reset();
        recenterViewport(width, height);
      },
    },
  ];

  return (
    <div className="fixed inset-x-0 top-4 mx-auto flex flex-row bg-background justify-center items-center p-1 gap-2 shadow-lg w-[420px] z-10 rounded-lg">
      <RadioGroup
        onValueChange={(brush) => setBrushMode(brush as BrushMode)}
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
        <OpenImage />
        {actions.map((action) => (
          <Button
            key={action.title}
            title={action.title}
            variant={action.variant ?? "outline"}
            size={"icon"}
            onClick={action?.action}
          >
            {action.children}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
