'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn, getAnnotationTypeFromColor } from '@/lib/utils';
import { FC } from 'react';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const colors = useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor } = useStoreActions();

  return (
    <div className="grid grid-rows-3 gap-2">
      {colors.map((color) => (
        <div
          className="flex flex-col items-center justify-center gap-1"
          key={color}
        >
          <div
            className={cn(
              color === currentColor && 'border-2',
              'h-4 w-8 cursor-pointer rounded-sm transition-all hover:scale-125',
            )}
            onClick={() => setColor(color)}
            style={{
              backgroundColor: color === currentColor ? 'transparent' : color,
              borderColor: color,
            }}
            title={getAnnotationTypeFromColor(color)}
          ></div>
          <p className="text-center text-xs text-muted-foreground">
            {getAnnotationTypeFromColor(color)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
