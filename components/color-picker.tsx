'use-client';

import {
  useStoreActions,
  useStoreColors,
  useStoreCurrentColor,
} from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { MoveDiagonal, MoveHorizontal, MoveVertical } from 'lucide-react';
import { FC } from 'react';

import { buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const { euclideanColors, horizontalColors, verticalColors } =
    useStoreColors();
  const currentColor = useStoreCurrentColor();
  const { setColor, setNewColor } = useStoreActions();

  return (
    <div className="grid grid-cols-3 p-2">
      <div className="col-span-1" id="vertical-pallete">
        {/* vertical input */}
        <Label className='cursor-pointer'>
          <MoveVertical size={16} />
          <Input
            className="h-0 w-0 collapse"
            defaultValue={verticalColors.slice(-1)}
            onChange={(e) => setNewColor(e.target.value, 'verticalColors')}
            type="color"
          />
        </Label>
        {/* vertical pallete */}
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
      <div className="col-span-1" id="horizontal-pallete">
        {/* horizontal input */}
        <Label className='cursor-pointer'>
          <MoveHorizontal size={16} />
          <Input
            className="h-0 w-0 invisible"
            defaultValue={horizontalColors.slice(-1)}
            onChange={(e) => setNewColor(e.target.value, 'horizontalColors')}
            type="color"
          />
        </Label>
        {/* horizontal pallete */}
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
      <div className="col-span-1" id="euclidean-pallete">
        {/* euclidean input */}
        <Label className='cursor-pointer'>
          <MoveDiagonal size={16} />
          <Input
            className="h-0 w-0 invisible"
            defaultValue={euclideanColors.slice(-1)}
            onChange={(e) => setNewColor(e.target.value, 'euclideanColors')}
            type="color"
          />
        </Label>
        {/* euclidean pallete */}
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

export default ColorPicker;
