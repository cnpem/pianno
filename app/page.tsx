import dynamic from "next/dynamic";
import Loading from "@/components/loading";

const Canvas = dynamic(
  () => import("@/components/canvas").then((m) => m.default),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const Toolbar = dynamic(
  () => import("@/components/toolbar").then((m) => m.default),
  {
    ssr: false,
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
