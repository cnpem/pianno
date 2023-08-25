"use client";

import * as PIXI from "pixi.js";
import { Stage, Sprite, useTick, useApp } from "@pixi/react";
import { useMemo, useState } from "react";
import Viewport from "./viewport";
import { Brush } from "./brush";
import { useWindowSize } from "@/hooks/use-window-size";
import { useStoreImg } from "@/hooks/use-store";
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
  const app = useApp();
  const { src } = useStoreImg();

  const img = useMemo(() => PIXI.Sprite.from(src), [src]);
  return (
    <Sprite
      texture={img.texture}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      anchor={0.5}
    />
  );
};

const CanvasWrapper = () => {
  const app = useApp();
  app.stage.hitArea = app.screen;
  const [width, height] = useWindowSize();
  const img = useStoreImg();

  return (
    <Viewport width={width} height={height}>
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
      id="canvas"
      width={width}
      height={height}
      options={{
        eventMode: "static",
        backgroundColor: 0xf0f2f2,
        backgroundAlpha: 0.2,
      }}
    >
      <CanvasWrapper />
    </Stage>
  );
};

export default Canvas;
