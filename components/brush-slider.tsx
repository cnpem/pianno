import { useStoreActions, useStoreBrushParams } from '@/hooks/use-store';
import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Slider } from './ui/slider';

interface BrushSliderProps {}

const BrushSlider: FC<BrushSliderProps> = ({}) => {
  const { maxSize, mode, size } = useStoreBrushParams();
  const { setBrushSize } = useStoreActions();
  useHotkeys(['up'], () => setBrushSize(size + 1));
  useHotkeys(['down'], () => setBrushSize(size - 1 > 0 ? size - 1 : 1));
  return (
    <div className="mt-4 flex w-full flex-col gap-2 px-2">
      <Slider
        className="w-full"
        max={maxSize}
        min={1}
        onValueChange={(value) => setBrushSize(value[0])}
        step={1}
        title={`${mode} size -- up/down`}
        value={[size]}
      />
      <span className="text-center text-xs text-slate-400">
        {mode} size: {size}
      </span>
    </div>
  );
};

export default BrushSlider;
