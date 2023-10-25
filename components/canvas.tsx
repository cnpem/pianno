'use client';

import {
  useStoreActions,
  useStoreImg,
  useStoreViewport,
} from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { Sprite, Stage, useApp, useTick } from '@pixi/react';
import throttle from 'lodash.throttle';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';

import Annotation from './annotation';
import AnnotationBar from './annotation-bar';
import Brush from './brush';
import Sidebar from './sidebar';
import Viewport from './viewport';

const useIteration = (incr = 0.1) => {
  const [i, setI] = useState(0);

  useTick((delta) => {
    setI((i) => i + incr * delta);
  });

  return i;
};

const Bunny = () => {
  const theta = useIteration(0.1);
  const app = useApp();
  const src = '/dino.png';

  return (
    <Sprite
      anchor={0.5}
      image={src}
      x={app.screen.width / 2}
      y={app.screen.height / 2 + Math.sin(theta) * 100}
      // rotation={Math.cos(theta) * 0.98}
    />
  );
};

const Data = () => {
  const { height, src, width } = useStoreImg();
  // recenter viewport when image changes
  const { recenterViewport } = useStoreActions();
  useEffect(() => {
    recenterViewport(width, height);
  }, [width, height, recenterViewport]);

  return <Sprite image={src} />;
};

type CanvasWrapperProps = {
  setPos: (pos: PIXI.Point) => void;
};

const CanvasWrapper = ({ setPos }: CanvasWrapperProps) => {
  const img = useStoreImg();
  const viewport = useStoreViewport();
  const app = useApp();

  // throttle pointermove event
  const t = throttle((e: PIXI.FederatedPointerEvent) => {
    const currentPos = viewport?.toWorld(e.global) ?? e.global;
    setPos(currentPos);
  }, 16);

  const handlePointerMove = useCallback(t, [t]);

  useEffect(() => {
    app.stage.on('pointermove', handlePointerMove);
    return () => {
      app.stage.off('pointermove', handlePointerMove);
    };
  }, [handlePointerMove, app.stage]);

  return (
    <Viewport>
      {img.src !== '#' ? (
        <>
          <Data />
          <Annotation height={img.height} width={img.width} />
          <Brush />
        </>
      ) : (
        <Bunny />
      )}
    </Viewport>
  );
};

interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {}

const Canvas = () => {
  // disable interpolation when scaling, will make texture be pixelated
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

  const [width, height] = useWindowSize();
  const [pos, setPos] = useState<PIXI.Point>(new PIXI.Point(0, 0));

  return (
    <div>
      <div className="fixed bottom-1 left-1">
        <span className="z-20 rounded-md bg-muted p-1 text-sm font-semibold text-purple-600 shadow-sm selection:bg-transparent">
          {pos.x.toFixed(2)} | {pos.y.toFixed(2)}
        </span>
      </div>
      <Sidebar />
      <AnnotationBar />
      <Stage
        height={height}
        options={{
          backgroundAlpha: 0,
          eventMode: 'static',
        }}
        width={width}
      >
        <CanvasWrapper setPos={setPos} />
      </Stage>
    </div>
  );
};

export default Canvas;
