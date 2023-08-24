"use client";
import dynamic from "next/dynamic";

const Canvas = dynamic(
  () => import("@/components/canvas").then((m) => m.default),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

const Toolbar = dynamic(
  () => import("@/components/toolbar").then((m) => m.default),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function Home() {
  return (
    <main className="min-h-screen antialiased">
      <Toolbar />
      <Canvas />
    </main>
  );
}
