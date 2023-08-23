"use client";
import { Download, Eraser, Grab, Pen, Undo, Redo } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";

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
];

export const Toolbar = () => {
  const [checked, setChecked] = useState("pen");
  console.log(checked);
  return (
    <div className="flex flex-row w-72 bg-background justify-center items-center p-2">
      <RadioGroup
        onValueChange={(v) => setChecked(v)}
        defaultValue={checked}
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
      <span className="flex-grow text-center text-input">|</span>
      <div className="flex flex-row gap-1">
        {actions.map((action) => (
          <Button key={action.title} variant="outline" size={"icon"}>
            {action.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
