'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn, getAnnotationTypeFromColor } from '@/lib/utils';
import { FC } from 'react';

import { Input } from './ui/input';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const colors = useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor } = useStoreActions();

  return (
    <div className="grid grid-cols-4 gap-2 px-2">
      {// color picker input for custom color
      }
      <Input
        className="col-span-4"
        onChange={(e) => setColor(e.target.value)}
        type="color"
        value={currentColor}
      />
      {colors.map((color) => (
 
          <div
            className={cn(
              color === currentColor && 'border-2',
              'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
            )}
            key={color}
            onClick={() => setColor(color)}
            style={{
              backgroundColor: color === currentColor ? 'transparent' : color,
              borderColor: color,
            }}
            title={getAnnotationTypeFromColor(color)}
          ></div>

      ))}
    </div>
  );
};

export default ColorPicker;
