'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const colors = useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor } = useStoreActions();

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {colors.map((color) => (
        <div
          key={color}
          className={cn(
            color === currentColor && 'border-2',
            'h-4 w-4 cursor-pointer rounded-full transition-all hover:scale-125',
          )}
          style={{
            borderColor: color,
            backgroundColor: color === currentColor ? 'transparent' : color,
          }}
          onClick={() => setColor(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
