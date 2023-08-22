"use client";

import { BlurFilter, ColorMatrixFilter } from "pixi.js";
import * as PIXI from "pixi.js";
import { Stage, Sprite, useTick, useApp } from "@pixi/react";
import { useMemo, useRef, useState } from "react";
import Viewport from "./viewport";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Brush } from "./brush";

const useIteration = (incr = 0.1) => {
  const [i, setI] = useState(0);

  useTick((delta) => {
    setI((i) => i + incr * delta);
  });

  return i;
};

const Bunny = () => {
  const theta = useIteration(0.1);
  const bunny = useMemo(
    () => PIXI.Sprite.from("https://pixijs.com/assets/bunny.png"),
    []
  );
  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={bunny.texture}
      x={400}
      y={270}
      scale={4}
      anchor={{ x: 0.5, y: 0.5 }}
      // rotation={Math.cos(theta) * 0.98}
    />
  );
};

const CanvasWrapper = () => {
  // pixel level view
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
  const [view, setView] = useState(null);

  const app = useApp();
  app.stage.hitArea = app.screen;
  // app.stage.on("pointermove", (e) => setPos(e.global));

  const viewportRef = useRef<PixiViewport>(null);

  // useEffect(() => {
  //   if (viewportRef.current !== null) {
  //     console.log(viewportRef.current);
  //     viewportRef.current.fit();
  //     viewportRef.current.update(2);
  //   }
  // }, []);

  return (
    <Viewport ref={viewportRef}>
      <Bunny />
      <Brush />
    </Viewport>
  );
};

export const Canvas = () => {
  return (
    <Stage
      width={800}
      height={600}
      options={{
        backgroundAlpha: 1,
        antialias: false,
        backgroundColor: 0x012b30,
        hello: true,
        eventMode: "static",
      }}
    >
      <CanvasWrapper />
    </Stage>
  );
};
