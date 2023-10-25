import type { BrushMode } from '@/lib/types';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStoreActions, useStoreBrushMode } from '@/hooks/use-store';
import { VariantProps } from 'class-variance-authority';
import { EraserIcon, GlassesIcon, PenIcon } from 'lucide-react';
import { FC } from 'react';

import { buttonVariants } from '../ui/button';

interface IToolbar {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

type Tool = {
    icon: React.ReactNode;
    title: string;
    };

const ToolItem = ({ icon, title }: Tool) => {
  return (
    <Label
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input bg-popover hover:bg-accent peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-400 peer-data-[state=checked]:[&>svg]:fill-violet-500 peer-data-[state=checked]:[&>svg]:stroke-violet-700"
      htmlFor={title}
      title={title}
    >
      {icon}
    </Label>
  );
};

const tools: Tool[] = [
    {
        icon: <PenIcon className="h-4 w-4" />,
        title: 'pen',
    },
    {
        icon: <EraserIcon className="h-4 w-4" />,
        title: 'eraser',
    },
    {
        icon: <GlassesIcon className="h-4 w-4" />,
        title: 'lens',
    },
    ];

interface ToolsProps {}

const Tools: FC<ToolsProps> = ({}) => {
    const brushMode = useStoreBrushMode();
    const {setBrushMode} = useStoreActions();
  return (
    <RadioGroup
          className="flex flex-row gap-1"
          onValueChange={(brush) => setBrushMode(brush as BrushMode)}
          value={brushMode}
        >
          {tools.map((tool) => (
            <div key={tool.title}>
              <RadioGroupItem
                className="peer sr-only"
                id={tool.title}
                value={tool.title}
              />
              <ToolItem icon={tool.icon} title={tool.title}/>
            </div>
          ))}
        </RadioGroup>
  );
};

export default Tools;
