"use client";
// import { Canvas } from "@/components/canvas";
// import { Toolbar } from "@/components/toolbar";
import dynamic from "next/dynamic";

const Canvas = dynamic(async () => {
  const { Canvas: Component } = await import("@/components/canvas");
  return { default: Component };
}, {
  ssr: false,
});

const Toolbar = dynamic(async () => {
  const { Toolbar: Component } = await import("@/components/toolbar");
  return { default: Component };
}, {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function Home() {
  return (
    <main className="min-h-screen antialiased">
      <Toolbar />
      <Canvas />
    </main>
  );
}
