import { useState, useCallback, useEffect } from "react";
import * as PIXI from "pixi.js";
import { useApp, Graphics } from "@pixi/react";
import { useStoreViewport } from "@/hooks/use-store";

export const Brush = () => {
  const [label, setLabel] = useState(4);
  const [size, setSize] = useState(10);

  // this.colors = ["red", "blue", "yellow", "magenta", "green", "indigo", "darkorange", "cyan", "pink", "yellowgreen"]
  const colors = [
    [255, 0, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 128, 0],
    [75, 0, 130],
    [255, 140, 0],
    [0, 255, 255],
    [255, 192, 203],
    [154, 205, 50],
  ];
  const [color, setColor] = useState(colors[label % colors.length]);
  const [pos, setPos] = useState(new PIXI.Point(0, 0));

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      let fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      g.beginFill(fillStyle);
      g.drawRect(0, 0, size, size);
      g.endFill();
    },
    [size, color]
  );
  const app = useApp();
  const viewport = useStoreViewport();

  useEffect(() => {
    app.stage.on("pointermove", (e) => {
      const currentPos = viewport?.toWorld(e.global) ?? e.global;
      setPos(new PIXI.Point(currentPos.x - size / 2, currentPos.y - size / 2));
    });
    return () => {
      app.stage.off("pointermove");
    };
  }, [app.stage, viewport, size]);

  // app.stage.onpointermove = (e) => {
  //   const currentPos = viewport?.toWorld(e.global) ?? e.global;
  //   setPos(new PIXI.Point(currentPos.x - size / 2, currentPos.y - size / 2));
  // };

  return (
    <Graphics
      draw={draw}
      x={pos.x}
      y={pos.y}
      blendMode={PIXI.BLEND_MODES.DIFFERENCE}
      alpha={0.7}
    />
  );
};
