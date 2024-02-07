import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";

const Load = () => {
  return (
    <div className="border rounded-sm flex flex-col items-center justify-center h-40">
      <div className="flex p-1 gap-1 flex-row h-fit opacity-90 items-center border shadow-lg rounded-md">
        {Array.from({ length: 2 }).map((_, i) => (
          <Button
            className="animate-pulse bg-muted"
            key={i}
            variant="outline"
            size="icon"
          />
        ))}
        <span className="text-input">|</span>
        <Button variant="outline" size="icon">
          <ImageIcon className="h-4 w-4" />
        </Button>
        {Array.from({ length: 3 }).map((_, i) => (
          <Button
            className="animate-pulse bg-muted"
            key={i}
            variant="outline"
            size="icon"
          />
        ))}
      </div>
      <p className="font-mono flex flex-row font-semibold text-input text-xs gap-1">
        <span>Please load an image to start</span>
        <ImageIcon className="inline h-4 w-4 stroke-purple-800" />
      </p>
    </div>
  );
};

export default Load;
