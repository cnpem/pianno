import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

export default function Home() {
  return (
    <main className="min-h-screen antialiased">
      <Toolbar />
      <Canvas />
    </main>
  );
}
