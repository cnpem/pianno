import { useStoreBrushMode } from '@/hooks/use-store';
import { FC } from 'react';

import BrushSlider from './brush-slider';
import ColorPicker from './color-picker';

const PenBar = () => {
  return (
    <div className="fixed inset-y-0 left-1 z-10 my-auto flex h-[200px] flex-col items-center justify-center rounded-lg bg-background opacity-90 shadow-lg">
      <ColorPicker />
      <BrushSlider />
    </div>
  );
};

const EraserBar = () => {
  return (
    <div className="fixed inset-y-0 left-1 z-10 my-auto flex h-[50px] flex-col items-center justify-center rounded-lg bg-background opacity-90 shadow-lg">
      <BrushSlider />
    </div>
  );
};

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const brushMode = useStoreBrushMode();

  return <>{brushMode === 'pen' ? <PenBar /> : <EraserBar />}</>;
};

export default Sidebar;
