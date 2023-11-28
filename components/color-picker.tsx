'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { MoveDiagonal, MoveHorizontal, MoveVertical } from 'lucide-react';
import { FC } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from './ui/button';
import { Popover } from './ui/popover';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const { euclideanColors, horizontalColors, verticalColors } =
    useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor, setNewColor } = useStoreActions();
  const debounced: typeof setNewColor = useDebouncedCallback((value, type) => {
    setNewColor(value, type);
  }, 300);

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      <PopoverPicker colorLabel="verticalColors" />
      <PopoverPicker colorLabel="horizontalColors" />
      <PopoverPicker colorLabel="euclideanColors" />
      <div className="col-span-1 ml-1" id="vertical-pallete">
        <div className="space-y-1">
          {verticalColors.map((color) => (
            <div
              className={cn(
                color === currentColor && 'border-4',
                'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
              )}
              key={color}
              onClick={() => setColor(color)}
              style={{
                backgroundColor: color === currentColor ? 'transparent' : color,
                borderColor: color,
              }}
              title={color}
            ></div>
          ))}
        </div>
      </div>
      <div className="col-span-1 ml-1" id="horizontal-pallete">
        <div className="space-y-1">
          {horizontalColors.map((color) => (
            <div
              className={cn(
                color === currentColor && 'border-4',
                'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
              )}
              key={color}
              onClick={() => setColor(color)}
              style={{
                backgroundColor: color === currentColor ? 'transparent' : color,
                borderColor: color,
              }}
              title={color}
            ></div>
          ))}
        </div>
      </div>
      <div className="col-span-1 ml-1" id="euclidean-pallete">
        <div className="space-y-1">
          {euclideanColors.map((color) => (
            <div
              className={cn(
                color === currentColor && 'border-4',
                'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
              )}
              key={color}
              onClick={() => setColor(color)}
              style={{
                backgroundColor: color === currentColor ? 'transparent' : color,
                borderColor: color,
              }}
              title={color}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PopoverPicker = ({
  colorLabel,
}: {
  colorLabel: 'euclideanColors' | 'horizontalColors' | 'verticalColors';
}) => {
  const { euclideanColors, horizontalColors, verticalColors } =
    useStoreColors();
  const { setNewColor } = useStoreActions();
  const debounced = useDebouncedCallback((value) => {
    setNewColor(value, colorLabel);
  }, 300);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-6 w-6" size={'icon'} variant="outline">
          {colorLabel === 'verticalColors' && (
            <MoveVertical className="h-4 w-4" />
          )}
          {colorLabel === 'horizontalColors' && (
            <MoveHorizontal className="h-4 w-4" />
          )}
          {colorLabel === 'euclideanColors' && (
            <MoveDiagonal className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-32 w-32 rounded-lg border bg-background p-1 shadow-lg"
        side="top"
      >
        {colorLabel === 'euclideanColors' && (
          <HexColorPicker
            color={euclideanColors.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {colorLabel === 'horizontalColors' && (
          <HexColorPicker
            color={horizontalColors.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {colorLabel === 'verticalColors' && (
          <HexColorPicker
            color={verticalColors.slice(-1)[0]}
            onChange={debounced}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
