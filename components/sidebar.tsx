import { useStoreBrushMode } from '@/hooks/use-store';
import { FC } from 'react';

import BrushSlider from './brush-slider';
import ColorPicker from './color-picker';

const PenBar = () => {
  return (
    <div className="fixed h-fit z-10 inset-y-0 left-1 my-auto grow w-20 items-center justify-center rounded-lg bg-background opacity-90 shadow-lg">
      <ColorPicker />
    </div>
  );
};

const EraserBar = () => {
  return (
    <div className="inset-y-0 left-1 z-10 my-auto flex items-center justify-center rounded-lg bg-background opacity-90 shadow-lg">
      <BrushSlider />
    </div>
  );
};

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const brushMode = useStoreBrushMode();

  return (
    <>
      {brushMode === 'pen' && <PenBar />}
      {brushMode === 'eraser' && <EraserBar />}
    </>
  );
};

export default Sidebar;
