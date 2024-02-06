'use client';

import { Egg } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Egg className="h-10 w-10 animate-bounce fill-amber-600 stroke-transparent" />
      <span className="text-amber-600">Loading...</span>
    </div>
  );
};

export default Loading;
