import { buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MoveDiagonal, MoveHorizontal, MoveVertical } from 'lucide-react';
import React from 'react';
import { useState, type FC } from 'react';
import { HexColorPicker } from 'react-colorful';

type ColorLabel = 'yellows' | 'teals' | 'purples';
const colorLabels: ColorLabel[] = ['yellows', 'teals', 'purples'];

type ColorPalette = Record<ColorLabel, string[]>;
const VIRIDIS_COLORS: ColorPalette = {
  purples: ['#3e4989', '#423f85', '#482878', '#440154'],
  teals: ['#21a685', '#1f9e89', '#228c8d', '#26828e'],
  yellows: ['#b5de2b', '#d0e11c', '#e7e419', '#fde725'],
};

interface PopoverPickerProps {
  colorLabel: ColorLabel;
  colors: ColorPalette;
  setNewColorCallback: (value: string, label: ColorLabel) => void;
}

const PopoverPicker: FC<PopoverPickerProps> = ({
  colors,
  colorLabel,
  setNewColorCallback,
}: PopoverPickerProps) => {
  const { yellows, teals, purples } = colors;

  return (
    <Popover>
      <PopoverTrigger asChild className="m-1 mt-0">
        <div
          className={cn(buttonVariants({ variant: 'outline' }), 'h-6 w-6 p-0')}
          style={{ marginTop: '0.25rem' }}
        >
          {colorLabel === 'yellows' && <MoveVertical className="h-4 w-4" />}
          {colorLabel === 'teals' && <MoveHorizontal className="h-4 w-4" />}
          {colorLabel === 'purples' && <MoveDiagonal className="h-4 w-4" />}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-32 w-32 rounded-lg border bg-background p-1 shadow-lg"
        side="top"
      >
        {['yellows', 'teals', 'purples'].includes(colorLabel) && (
          <HexColorPicker
            color={colors[colorLabel].slice(-1)[0]}
            onChange={(value) => setNewColorCallback(value, colorLabel)}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

interface ColorArrayViewProps {
  colorArray: string[];
  currentColor: string;
  setCurrentColor: (value: string) => void;
}
const ColorArrayView = React.forwardRef<
  HTMLDivElement,
  ColorArrayViewProps & React.ComponentPropsWithoutRef<'div'>
>(({ colorArray, currentColor, setCurrentColor, ...props }, ref) => {
  return (
    <div
      className="flex flex-col"
      style={{ margin: '0', padding: '0' }}
      ref={ref}
      {...props}
    >
      {colorArray.map((color) => (
        <div
          className={cn(
            color === currentColor && 'border-4',
            'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
          )}
          key={color}
          onClick={() => setCurrentColor(color)}
          style={{
            backgroundColor: color === currentColor ? 'transparent' : color,
            borderColor: color,
            margin: '4px',
          }}
          title={color}
        />
      ))}
    </div>
  );
});

const ColorPicker = () => {
  const [colors, setColors] = useState(VIRIDIS_COLORS);
  const [currentColor, setCurrentColor] = useState(colors.yellows.slice(-1)[0]);
  const setNewColor = (value: string, label: ColorLabel) => {
    // if color already exists, do nothing
    if (colors[label].includes(value)) return;
    setColors((colors) => ({ ...colors, [label]: [...colors[label], value] }));
    setCurrentColor(value);
  };

  return (
    <div
      className="h-fit w-fit rounded-md border border-input bg-background shadow-lg"
      style={{ marginTop: '0' }}
      id="pallete-container"
    >
      <div
        className="items-center justify-center p-0 "
        id="title-row"
        style={{ marginTop: '0' }}
      >
        <PopoverPicker
          colorLabel="yellows"
          colors={colors}
          setNewColorCallback={setNewColor}
        />
        <PopoverPicker
          colorLabel="teals"
          colors={colors}
          setNewColorCallback={setNewColor}
        />
        <PopoverPicker
          colorLabel="purples"
          colors={colors}
          setNewColorCallback={setNewColor}
        />
      </div>
      <div
        className="grid grid-cols-3 gap-1 p-0 pb-1 pl-1"
        id="color-cols"
        style={{ marginTop: '0' }}
      >
        {colorLabels.map((label) => (
          <ColorArrayView
            key={label}
            colorArray={colors[label]}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
