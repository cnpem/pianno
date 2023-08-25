import { useState, useCallback, useEffect, use } from "react";
import * as PIXI from "pixi.js";
import { useApp, Graphics } from "@pixi/react";
import { useStoreCurrentColor, useStoreViewport } from "@/hooks/use-store";

export const Brush = () => {
  const color = useStoreCurrentColor();
  
  const [size, setSize] = useState(10);
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
