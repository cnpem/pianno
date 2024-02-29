'use client';

import { useStoreActions, useStoreToggled } from '@/hooks/use-store';
import { Eye, EyeOff } from 'lucide-react';
import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Toggle } from '../ui/toggle';

interface TogglePairsProps {
  disabled?: boolean;
}

const TogglePairs: FC<TogglePairsProps> = ({ disabled }) => {
  useHotkeys(
    '6',
    () => {
      toggle();
    },
    { enabled: !disabled },
  );
  const toggled = useStoreToggled();
  const { toggle } = useStoreActions();
  return (
    <Toggle
      aria-label="toggle pairs -- 6"
      className="group relative"
      disabled={disabled}
      onPressedChange={toggle}
      pressed={toggled}
      title="toggle pairs -- 5"
    >
      <p className="absolute right-1 top-0 text-xs text-input group-hover:text-accent-foreground">
        6
      </p>
      {toggled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </Toggle>
  );
};

export default TogglePairs;
