import { FC } from 'react';

import BrushSlider from './brush-slider';
import ColorPicker from './color-picker';

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  return (
    <div className="fixed inset-y-0 left-1 z-10 my-auto flex h-[200px] flex-col items-center justify-center rounded-lg bg-background shadow-lg">
      <ColorPicker />
      <BrushSlider />
    </div>
  );
};

export default Sidebar;
