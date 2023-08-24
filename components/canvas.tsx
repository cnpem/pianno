"use client";

import * as PIXI from "pixi.js";
import { Stage, Sprite, useTick, useApp } from "@pixi/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Viewport from "./viewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Brush } from "./brush";
import { useWindowSize } from "@/hooks/use-window-size";
import { useStoreViewport } from "@/hooks/use-store";

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

  const bunny = useMemo(
    () => PIXI.Sprite.from("https://pixijs.com/assets/bunny.png"),
    []
  );
  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={bunny.texture}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={4}
      anchor={0.5}
      // rotation={Math.cos(theta) * 0.98}
    />
  );
};

const CanvasWrapper = () => {
  const app = useApp();
  app.stage.hitArea = app.screen;
  const [width, height] = useWindowSize();

  return (
    <Viewport width={width} height={height}>
      <Bunny />
      <Brush />
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
      }}
    >
      <CanvasWrapper />
    </Stage>
  );
};

export default Canvas;
