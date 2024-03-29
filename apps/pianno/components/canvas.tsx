'use client';

import {
  useStoreActions,
  useStoreImg,
  useStoreToggled,
  useStoreViewport,
} from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { StoreContext } from '@/providers/store';
import { ColorMapFilter } from '@pixi/filter-color-map';
import {
  Container,
  Sprite,
  Stage,
  useApp,
  useTick,
  withFilters,
} from '@pixi/react';
import throttle from 'lodash.throttle';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';

import Annotation from './annotation';
import Brush from './brush';
import Help from './help';
import Pairs from './pairs';
import Sidebar from './sidebar';
import Viewport from './viewport';

const useIteration = (incr = 0.1) => {
  const [i, setI] = useState(0);

  useTick((delta) => {
    setI((i) => i + incr * delta);
  });

  return i;
};

const Filters = withFilters(Container, {
  colormap: ColorMapFilter,
});

const Bunny = () => {
  const theta = useIteration(0.03);
  const app = useApp();
  const src = '/pianno-floating-logo.png';

  const texture = PIXI.Texture.from(src);

  const calcScale = () => {
    const textureAspectRatio = texture.width / texture.height;
    const screenAspectRatio = app.screen.width / app.screen.height;

    if (screenAspectRatio < textureAspectRatio) {
      return (2 / 3) * (app.screen.width / texture.width);
    }
    return (2 / 3) * (app.screen.height / texture.height);
  };

  return (
    <Sprite
      anchor={0.5}
      scale={calcScale()}
      texture={texture}
      x={app.screen.width / 2}
      y={app.screen.height / 2 + Math.sin(theta) * 15}
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

  return (
    <Filters
      colormap={{
        colorMap: PIXI.Texture.from('/cmaps/gray_colormap.png'),
        nearest: true,
      }}
    >
      <Sprite image={src} />
    </Filters>
  );
};

type CanvasWrapperProps = {
  setPos: (pos: PIXI.Point) => void;
};

const CanvasWrapper = ({ setPos }: CanvasWrapperProps) => {
  const img = useStoreImg();
  const toggled = useStoreToggled();
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

  if (img.src === '#' || !img.src) {
    return (
      <Viewport>
        <Bunny />
      </Viewport>
    );
  }

  return (
    <Viewport>
      <Data />
      <Annotation height={img.height} width={img.width} />
      {toggled && <Pairs />}
      <Brush />
    </Viewport>
  );
};

interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {}

const Canvas = () => {
  // disable interpolation when scaling, will make texture be pixelated
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

  const [width, height] = useWindowSize();
  const { src } = useStoreImg();
  const [pos, setPos] = useState<PIXI.Point>(new PIXI.Point(0, 0));

  return (
    <div>
      <div className="fixed bottom-1 left-1">
        <span className="z-20 rounded-md bg-muted p-1 text-sm font-semibold text-purple-600 shadow-sm selection:bg-transparent">
          {pos.x.toFixed(2)} | {pos.y.toFixed(2)}
        </span>
      </div>
      {src !== '#' && <Sidebar />}
      <Help />
      <StoreContextBridge
        render={(children) => (
          <Stage
            height={height}
            options={{
              backgroundAlpha: 0,
              eventMode: 'static',
            }}
            width={width}
          >
            {children}
          </Stage>
        )}
      >
        <CanvasWrapper setPos={setPos} />
      </StoreContextBridge>
    </div>
  );
};

type ContextBridgeProps = {
  children: React.ReactNode;
  render: (children: React.ReactNode) => React.ReactNode;
};

const StoreContextBridge = ({ children, render }: ContextBridgeProps) => {
  return (
    <StoreContext.Consumer>
      {(value) =>
        render(
          <StoreContext.Provider value={value}>
            {children}
          </StoreContext.Provider>,
        )
      }
    </StoreContext.Consumer>
  );
};

export default Canvas;
