"use client";

import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Sprite, useApp } from "@pixi/react";
import {
  useStoreActions,
  useStoreAnnotation,
  useStoreAnnotationCoords,
  useStoreBrushMode,
  useStoreBrushSize,
  useStoreColors,
  useStoreViewport,
} from "@/hooks/use-store";
import { useWindowSize } from "@/hooks/use-window-size";

type AnnotationProps = {
  width: number;
  height: number;
};

const useInitAnnotation = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const { setAnnotation } = useStoreActions();
  useEffect(() => {
    const example = new Array(width * height).fill(2);
    setAnnotation(example);
  }, [height, setAnnotation, width]);
};

const Annotation = (props: AnnotationProps) => {
  const colors = useStoreColors();
  const app = useApp();
  const canvas = app.renderer.extract.canvas(app.stage);
  canvas.width = props.width;
  canvas.height = props.height;
  const context = canvas.getContext("2d");
  const [width, height] = useWindowSize();
  const sprite = PIXI.Sprite.from(canvas);

  const prevPosition = useRef<PIXI.Point | null>(null);
  const currPosition = useRef<PIXI.Point | null>(null);

  const brushSize = useStoreBrushSize();
  const brushMode = useStoreBrushMode();
  const viewport = useStoreViewport();

  const coords = useStoreAnnotationCoords();
  const annotation = useStoreAnnotation();
  const [isPainting, setIsPainting] = React.useState(false);

  useInitAnnotation({ width: canvas.width, height: canvas.height });

  useEffect(() => {
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
    draw(annotation);
  }, [context, canvas, colors, sprite.texture, width, height, annotation]);

  const distanceBetween = (point1: PIXI.Point, point2: PIXI.Point) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };

  const angleBetween = (point1: PIXI.Point, point2: PIXI.Point) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  const draw = () => {
    if (!context) return;
    if (!prevPosition.current || !currPosition.current) return;
    if (brushMode == "eraser") {
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }

    if (currPosition.current == prevPosition.current) {
      let x = Math.round(prevPosition.current.x - brushSize / 2);
      let y = Math.round(prevPosition.current.y - brushSize / 2);
      context.drawImage(canvas, x, y, brushSize, brushSize);
      sprite.texture.update();
      return [[x, y]];
    }

    let coords = [];
    let dist = distanceBetween(prevPosition.current, currPosition.current);
    let angle = angleBetween(prevPosition.current, currPosition.current);
    for (let i = 0; i < dist; i++) {
      let x = Math.round(
        prevPosition.current.x + Math.sin(angle) * i - brushSize / 2
      );
      let y = Math.round(
        prevPosition.current.y + Math.cos(angle) * i - brushSize / 2
      );
      context.drawImage(canvas, x, y, brushSize, brushSize);
      coords.push([x, y]);
    }
    sprite.texture.update();
    return coords;
  };

  function onPointerDown(event: PIXI.FederatedPointerEvent) {
    if (event.pointerType == "mouse") {
      if (event.button != 0) return;
    } else if (event.pointerType == "touch") {
      viewport?.plugins.pause("drag");
      // canvas.brush.cursor.visible = false
    }

    setIsPainting(true);

    // currPosition.current = viewport?.toWorld(event.global) ?? event.global;
    // setPrevPosition(currPosition);
  }

  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={sprite.texture}
      blendMode={PIXI.BLEND_MODES.MULTIPLY}
    />
  );
};

export default Annotation;
