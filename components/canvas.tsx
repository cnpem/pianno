"use client";

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
  // disable interpolation when scaling, will make texture be pixelated
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
  return (
    <Stage
      width={1000}
      height={650}
      options={{
        eventMode: "static",
        backgroundColor: 0xc165ff,
      }}
    >
      <CanvasWrapper />
    </Stage>
  );
};
