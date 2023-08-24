"use client";
import {
  Download,
  Eraser,
  Grab,
  Pen,
  Undo,
  Redo,
  Maximize,
  Image,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  type BrushMode,
  useStoreActions,
  useStoreBrushMode,
  useStoreViewport,
} from "@/hooks/use-store";

interface IToolbar {
  title: string;
  children: React.ReactNode;
  action?: () => void;
}

const ToolItem = ({ title, children }: IToolbar) => {
  return (
    <Label
      htmlFor={title}
      title={title}
      className="flex items-center justify-center rounded-md border border-input bg-popover h-10 w-10 hover:bg-accent peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-400 peer-data-[state=checked]:[&>svg]:fill-violet-500 peer-data-[state=checked]:[&>svg]:stroke-violet-700"
    >
      {children}
    </Label>
  );
};

const tools = [
  {
    title: "pen",
    icon: <Pen className="h-4 w-4" />,
  },
  {
    title: "eraser",
    icon: <Eraser className="h-4 w-4" />,
  },
  {
    title: "grab",
    icon: <Grab className="h-4 w-4" />,
  },
];

const actions = [
  {
    title: "open-image",
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image className="h-4 w-4" />,
  },
  {
    title: "undo",
    icon: <Undo className="h-4 w-4" />,
  },
  {
    title: "redo",
    icon: <Redo className="h-4 w-4" />,
  },
  {
    title: "save",
    icon: <Download className="h-4 w-4" />,
  },
  {
    title: "fit-view",
    icon: <Maximize className="h-4 w-4" />,
    action: () => {
      console.log("fit-view");
    },
  },
];

export const Toolbar = () => {
  const viewport = useStoreViewport();
  const brushMode = useStoreBrushMode();
  const { setBrushMode } = useStoreActions();
  const recenter = (w: number, h: number) => {
    viewport?.moveCenter(w / 2, h / 2);
    viewport?.fit(true, w, h);
  };
  return (
    <div className="fixed inset-x-0 top-4 mx-auto flex flex-row bg-background justify-center items-center p-1 gap-2 shadow-lg w-[400px] z-10 rounded-lg">
      <RadioGroup
        onValueChange={(brush) => setBrushMode(brush as BrushMode)}
        defaultValue={brushMode}
        className="grid grid-cols-3 gap-1"
      >
        {tools.map((tool) => (
          <div key={tool.title}>
            <RadioGroupItem
              value={tool.title}
              id={tool.title}
              className="peer sr-only"
            />
            <ToolItem title={tool.title}>{tool.icon}</ToolItem>
          </div>
        ))}
      </RadioGroup>
      <span className="flex text-center text-input">|</span>
      <div className="flex flex-row gap-1">
        {actions.map((action) => (
          <Button
            key={action.title}
            title={action.title}
            variant="outline"
            size={"icon"}
            onClick={() => recenter(window.innerWidth, window.innerHeight)}
          >
            {action.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
