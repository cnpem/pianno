import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';

import { buttonVariants } from './ui/button';

interface HelpProps {}

const Help: FC<HelpProps> = ({}) => {
  return (
    <Link
      className={cn(
        buttonVariants({ size: 'icon', variant: 'outline' }),
        'fixed bottom-1 right-1 z-10 opacity-90 shadow-lg',
      )}
      href="https://cnpem.github.io/pianno/"
      rel="noopener noreferrer"
      target="_blank"
      title="help"
    >
      ?
    </Link>
  );
};

export default Help;
