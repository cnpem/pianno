'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { MoveDiagonal, MoveHorizontal, MoveVertical } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const { euclidean, horizontal, vertical } = useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor, setNewColor } = useStoreActions();
  const debounced: typeof setNewColor = useDebouncedCallback((value, type) => {
    setNewColor(value, type);
  }, 300);

  // changing pallete "sideways" using the arrow keys
  useHotkeys(['left'], () => {
    if (euclidean.includes(currentColor)) {
      setColor(horizontal[euclidean.indexOf(currentColor)] || horizontal[0]);
      return;
    }
    if (horizontal.includes(currentColor)) {
      setColor(vertical[horizontal.indexOf(currentColor)] || vertical[0]);
      return;
    }
  });
  useHotkeys(['right'], () => {
    if (vertical.includes(currentColor)) {
      setColor(horizontal[vertical.indexOf(currentColor)] || horizontal[0]);
      return;
    }
    if (horizontal.includes(currentColor)) {
      setColor(euclidean[horizontal.indexOf(currentColor)] || euclidean[0]);
      return;
    }
  });

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      <PopoverPicker colorLabel="vertical" />
      <PopoverPicker colorLabel="horizontal" />
      <PopoverPicker colorLabel="euclidean" />
      <PalleteColumn colorLabel="vertical" colors={vertical} />
      <PalleteColumn colorLabel="horizontal" colors={horizontal} />
      <PalleteColumn colorLabel="euclidean" colors={euclidean} />
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
        isFocused && 'border-4',
        'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125 focus:scale-125 focus:outline-none',
      )}
      onClick={onClick}
      ref={ref}
      style={{
        backgroundColor: isFocused ? 'transparent' : color,
        borderColor: color,
      }}
      title={color}
    ></button>
  );
};

type PalleteColumnProps = {
  colorLabel: 'euclidean' | 'horizontal' | 'vertical';
  colors: string[];
};
const PalleteColumn = ({ colorLabel, colors }: PalleteColumnProps) => {
  const currentColor = useStoreCurrentColor();
  const { setColor } = useStoreActions();
  const currentIsPallete = colors.includes(currentColor);

  // changing color "up" and "down" using the arrow keys
  useHotkeys(
    ['up'],
    () => setColor(colors[colors.indexOf(currentColor) - 1] || currentColor),
    { enabled: currentIsPallete },
  );
  useHotkeys(
    ['down'],
    () => setColor(colors[colors.indexOf(currentColor) + 1] || currentColor),
    { enabled: currentIsPallete },
  );

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

const PopoverPicker = ({
  colorLabel,
}: {
  colorLabel: 'euclidean' | 'horizontal' | 'vertical';
}) => {
  const { euclidean, horizontal, vertical } = useStoreColors();
  const { setNewColor } = useStoreActions();
  const debounced = useDebouncedCallback((value) => {
    setNewColor(value, colorLabel);
  }, 300);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-6 w-6" size={'icon'} variant="outline">
          {colorLabel === 'vertical' && <MoveVertical className="h-4 w-4" />}
          {colorLabel === 'horizontal' && (
            <MoveHorizontal className="h-4 w-4" />
          )}
          {colorLabel === 'euclidean' && <MoveDiagonal className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-32 w-32 rounded-lg border bg-background p-1 shadow-lg"
        side="top"
      >
        {colorLabel === 'euclidean' && (
          <HexColorPicker
            color={euclidean.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {colorLabel === 'horizontal' && (
          <HexColorPicker
            color={horizontal.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {colorLabel === 'vertical' && (
          <HexColorPicker
            color={vertical.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
