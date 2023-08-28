"use client";

import { Egg } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Egg className="h-10 w-10 animate-bounce fill-amber-600 stroke-transparent" />
      <span className="text-amber-600">Loading...</span>
    </div>
  );
};

export default Loading;
