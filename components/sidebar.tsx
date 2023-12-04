import { useStoreBrushParams } from '@/hooks/use-store';
import { FC } from 'react';

import BrushSlider from './brush-slider';
import ColorPicker from './color-picker';

const PenBar = () => {
  return (
    <div className="fixed inset-y-0 left-1 z-10 my-auto h-fit items-center rounded-lg bg-background opacity-90 shadow-lg">
      <ColorPicker />
    </div>
  );
};

const EraserBar = () => {
  return (
    <div className="fixed inset-y-0 left-1 z-10 my-auto h-fit items-center rounded-lg bg-background opacity-90 shadow-lg">
      <BrushSlider />
    </div>
  );
};

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const { mode: brushMode } = useStoreBrushParams();

  return (
    <>
      {brushMode === 'pen' && <PenBar />}
      {brushMode === 'eraser' && <EraserBar />}
    </>
  );
};

export default Sidebar;
