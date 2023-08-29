"use client";

import * as PIXI from "pixi.js";
import { Stage, Sprite, useTick, useApp, Container } from "@pixi/react";
import { useMemo, useState } from "react";
import Viewport from "./viewport";
import { Brush } from "./brush";
import { useWindowSize } from "@/hooks/use-window-size";
import { useStoreActions, useStoreImg, useStoreViewport } from "@/hooks/use-store";
import Annotation from "./annotation";

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
  const src = "https://pixijs.io/pixi-react/img/bunny.png";

  const bunny = useMemo(() => PIXI.Sprite.from(src), [src]);
  return (
    <Sprite
      texture={bunny.texture}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      anchor={0.5}
      scale={4}
      rotation={Math.cos(theta) * 0.98}
    />
  );
};

const Data = () => {
  const { src, width, height } = useStoreImg();
  // recenter viewport when image changes
  const { recenterViewport } = useStoreActions();
  recenterViewport(width, height);

  return <Sprite image={src} />;
};

const CanvasWrapper = () => {
  const img = useStoreImg();

  return (
    <Viewport>
      {img.src !== "#" ? (
        <>
          <Data />
          <Annotation width={img.width} height={img.height} />
          <Brush />
        </>
      ) : (
        <Bunny />
      )}
    </Viewport>
  );
};

interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {}

const Canvas = (props: CanvasProps) => {
  // disable interpolation when scaling, will make texture be pixelated
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

  const [width, height] = useWindowSize();

  return (
    <Stage
      width={width}
      height={height}
      options={{
        eventMode: "static",
        backgroundAlpha: 0,
      }}
    >
      <CanvasWrapper />
    </Stage>
  );
};

export default Canvas;
