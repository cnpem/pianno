import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

export default function Home() {
  return (
    <main>
      <div className="container w-80 sticky top-0 inset-x-0 z-40">
        <Toolbar />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <Canvas />
      </div>
    </main>
  );
}
