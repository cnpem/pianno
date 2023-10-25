import {
  useStoreActions,
  useStoreBrushMode,
  useStoreBrushSize,
} from '@/hooks/use-store';
import { FC } from 'react';

import { Slider } from './ui/slider';

interface BrushSliderProps {}

const BrushSlider: FC<BrushSliderProps> = ({}) => {
  const brushSize = useStoreBrushSize();
  const brushMode = useStoreBrushMode();
  const { setBrushSize } = useStoreActions();
  return (
    <div className="mt-4 flex w-full flex-col gap-2 px-2">
      <Slider
        className="w-full"
        max={40}
        min={1}
        onValueChange={(value) => setBrushSize(value[0])}
        step={1}
        title={`${brushMode} size`}
        value={[brushSize]}
      />
      <span className="text-center text-xs text-slate-400">
        {brushMode} size: {brushSize}
      </span>
    </div>
  );
};

export default BrushSlider;
