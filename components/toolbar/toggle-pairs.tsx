'use client';

import { useStoreActions, useStoreToggled } from '@/hooks/use-store';
import { Eye, EyeOff } from 'lucide-react';
import { FC } from 'react';

import { Toggle } from '../ui/toggle';

interface TogglePairsProps {
  disabled?: boolean;
}

const TogglePairs: FC<TogglePairsProps> = ({disabled}) => {
  const toggled = useStoreToggled();
  const { toggle } = useStoreActions();
  return (
    <Toggle
      aria-label="toggle pairs"
      disabled={disabled}
      onPressedChange={toggle}
      pressed={toggled}
    >
      {toggled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </Toggle>
  );
};

export default TogglePairs;
