import Loading from '@/components/loading';
import dynamic from 'next/dynamic';

const Canvas = dynamic(
  () => import('@/components/canvas').then((m) => m.default),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const Toolbar = dynamic(
  () => import('@/components/toolbar/toolbar').then((m) => m.default),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <main className="min-h-screen antialiased">
      <Toolbar />
      <Canvas />
    </main>
  );
}
