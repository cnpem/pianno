import { Label } from '@/components/ui/label';
import { VariantProps } from 'class-variance-authority';
import { EraserIcon, GlassesIcon, PenIcon } from 'lucide-react';
import { FC } from 'react';

import { buttonVariants } from '../ui/button';
import { useStoreActions, useStoreBrushMode } from '@/hooks/use-store';
import type { BrushMode } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface IToolbar {
  title: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  disabled?: boolean;
  onClick?: () => void;
}

type Tool = {
    title: string;
    icon: React.ReactNode;
    };

const ToolItem = ({ title, icon }: Tool) => {
  return (
    <Label
      htmlFor={title}
      title={title}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input bg-popover hover:bg-accent peer-data-[state=checked]:border-violet-600 peer-data-[state=checked]:bg-violet-400 peer-data-[state=checked]:[&>svg]:fill-violet-500 peer-data-[state=checked]:[&>svg]:stroke-violet-700"
    >
      {icon}
    </Label>
  );
};

const tools: Tool[] = [
    {
        title: 'pen',
        icon: <PenIcon className="h-4 w-4" />,
    },
    {
        title: 'eraser',
        icon: <EraserIcon className="h-4 w-4" />,
    },
    {
        title: 'lens',
        icon: <GlassesIcon className="h-4 w-4" />,
    },
    ];

interface ToolsProps {}

const Tools: FC<ToolsProps> = ({}) => {
    const brushMode = useStoreBrushMode();
    const {setBrushMode} = useStoreActions();
  return (
    <RadioGroup
          onValueChange={(brush) => setBrushMode(brush as BrushMode)}
          value={brushMode}
          className="flex flex-row gap-1"
        >
          {tools.map((tool) => (
            <div key={tool.title}>
              <RadioGroupItem
                value={tool.title}
                id={tool.title}
                className="peer sr-only"
              />
              <ToolItem title={tool.title} icon={tool.icon}/>
            </div>
          ))}
        </RadioGroup>
  );
};

export default Tools;
