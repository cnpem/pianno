import { useStoreActions, useStoreBrushSize } from '@/hooks/use-store';
import { FC } from 'react';

import { Slider } from './ui/slider';

interface BrushSliderProps {}

const BrushSlider: FC<BrushSliderProps> = ({}) => {
  const brushSize = useStoreBrushSize();
  const { setBrushSize } = useStoreActions();
  return (
    <div className="mt-4 flex w-full flex-col gap-2 px-2">
      <Slider
        title="brush size"
        className="w-full"
        value={[brushSize]}
        onValueChange={(value) => setBrushSize(value[0])}
        step={1}
        max={40}
        min={1}
      />
      <span className="text-xs text-slate-400">brush size: {brushSize}</span>
    </div>
  );
};

export default BrushSlider;
