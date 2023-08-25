'use client';

import React, { useEffect, useMemo, useState } from "react";
import * as PIXI from "pixi.js";
import { Sprite, useApp } from "@pixi/react";
import { useStoreColors } from "@/hooks/use-store";
import { useWindowSize } from "@/hooks/use-window-size";

type AnnotationProps = {
  width: number;
  height: number;
};

const Annotation = (props:AnnotationProps) => {
  const colors = useStoreColors();
  const app = useApp();
  const canvas = app.renderer.extract.canvas(app.stage);
  canvas.width = props.width
  canvas.height = props.height
  const context = canvas.getContext("2d");
  const [width, height] = useWindowSize();
  const sprite = PIXI.Sprite.from(canvas);

  useEffect(() => {
    const example = new Array(width * height).fill(2);

    const draw = (slice: any) => {
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      let data = imageData.data;
      for (let i = 0; i < slice.length; i++) {
        if (slice[i] >= 0) {
          let color = colors[slice[i] % colors.length];
          data[i * 4] = color[0];
          data[i * 4 + 1] = color[1];
          data[i * 4 + 2] = color[2];
          data[i * 4 + 3] = 255;
        }
      }
      context.putImageData(imageData, 0, 0);
      sprite.texture.update();
    };
    draw(example);
  }, [context, canvas, colors, sprite.texture, width, height]);

  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={sprite.texture}
      x={width/2}
      y={height/2}
      blendMode={PIXI.BLEND_MODES.MULTIPLY}

      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};

export default Annotation;
