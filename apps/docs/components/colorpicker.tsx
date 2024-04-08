"use client";

import {
  MoveDiagonalIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

const VIRIDIS_COLORS = {
  purples: ["#3e4989", "#423f85", "#482878", "#440154"],
  teals: ["#21a685", "#1f9e89", "#228c8d", "#26828e"],
  yellows: ["#b5de2b", "#d0e11c", "#e7e419", "#fde725"],
};

export const annotationColorPallete = {
  euclidean: VIRIDIS_COLORS.purples,
  horizontal: VIRIDIS_COLORS.teals,
  vertical: VIRIDIS_COLORS.yellows,
};

const ColorPicker = () => {
  const [currentColor, setCurrentColor] = useState<string>("#3e4989");
  const { vertical, horizontal, euclidean } = annotationColorPallete;
  return (
    <div className="border rounded-sm flex flex-col items-center justify-center h-64 p-12">
      <div className="flex opacity-90 items-start border shadow-lg rounded-md h-fit">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Button className="h-6 w-6" variant="outline" size="icon">
            <MoveVerticalIcon className="h-4 w-4" />
          </Button>
          <Button className="h-6 w-6" variant="outline" size="icon">
            <MoveHorizontalIcon className="h-4 w-4" />
          </Button>
          <Button className="h-6 w-6" variant="outline" size="icon">
            <MoveDiagonalIcon className="h-4 w-4" />
          </Button>
          <PalleteColumn
            currentColor={currentColor}
            setColor={setCurrentColor}
            colorLabel="vertical"
            colors={vertical}
          />
          <PalleteColumn
            colorLabel="horizontal"
            colors={horizontal}
            currentColor={currentColor}
            setColor={setCurrentColor}
          />
          <PalleteColumn
            colorLabel="euclidean"
            colors={euclidean}
            currentColor={currentColor}
            setColor={setCurrentColor}
          />
        </div>
      </div>
    </div>
  );
};

const PalleteColorButton = ({
  color,
  isFocused,
  onClick,
}: {
  color: string;
  isFocused: boolean;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    }
  }, [isFocused]);

  return (
    <button
      className={cn(
        isFocused && "border-4",
        "h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125 focus:scale-125 focus:outline-none"
      )}
      onClick={onClick}
      ref={ref}
      style={{
        backgroundColor: isFocused ? "transparent" : color,
        borderColor: color,
      }}
      title={color}
    ></button>
  );
};

type PalleteColumnProps = {
  currentColor: string;
  setColor: Dispatch<SetStateAction<string>>;
  colorLabel: "euclidean" | "horizontal" | "vertical";
  colors: string[];
};
const PalleteColumn = ({
  currentColor,
  setColor,
  colorLabel,
  colors,
}: PalleteColumnProps) => {
  return (
    <div
      className="col-span-1 ml-1 flex flex-col gap-1"
      id={`${colorLabel}-pallete`}
    >
      {colors.map((color, index) => (
        <PalleteColorButton
          color={color}
          isFocused={currentColor === color}
          key={color}
          onClick={() => setColor(color)}
        />
      ))}
    </div>
  );
};

export { ColorPicker };
