'use client';

import {
  useStoreActions,
  useStoreAnnotation,
  useStoreAnnotationCoords,
  useStoreBrushMode,
  useStoreBrushSize,
  useStoreColors,
  useStoreCurrentColor,
  useStoreViewport,
} from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { hexToRgb } from '@/lib/utils';
import { Sprite, useApp } from '@pixi/react';
import * as PIXI from 'pixi.js';
import React, { useEffect, useRef } from 'react';

type AnnotationProps = {
  width: number;
  height: number;
};

const useInitAnnotation = ({ width, height }: AnnotationProps) => {
  const { setAnnotation } = useStoreActions();
  useEffect(() => {
    const annot = Array.from({ length: width * height }, () => -1);
    // const annot = Array.from({ length: width * height }, () =>
    //   Math.floor(Math.random() * 10),
    // );
    setAnnotation(annot);
  }, [height, setAnnotation, width]);
};

const useCanvas = ({ width, height }: AnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let canvas = canvasRef.current;
    canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    canvasRef.current = canvas;

    return () => {
      canvas?.remove();
      canvasRef.current?.remove();
    };
  }, [height, width]);
  return canvasRef;
};

const Annotation = (props: AnnotationProps) => {
  const canvasRef = useCanvas({ width: props.width, height: props.height });
  useInitAnnotation({ width: props.width, height: props.height });

  const colors = useStoreColors();
  const color = useStoreCurrentColor();
  const app = useApp();
  const canvas = canvasRef.current;
  const context = canvas?.getContext('2d', { willReadFrequently: true });
  const [width, height] = useWindowSize();
  const sprite = PIXI.Sprite.from(canvas ?? PIXI.Texture.EMPTY);

  const prevPosition = useRef<PIXI.Point | null>(null);
  const currPosition = useRef<PIXI.Point | null>(null);

  const brushSize = useStoreBrushSize();
  const brushMode = useStoreBrushMode();
  const viewport = useStoreViewport();

  const coords = useStoreAnnotationCoords();
  const annotation = useStoreAnnotation();
  const [isPainting, setIsPainting] = React.useState(false);

  useEffect(() => {
    const onPointerDown = (e: PIXI.FederatedPointerEvent) => {
      const { x, y } = viewport?.toWorld(e.global) ?? e.global;
      if (x < 0 || y < 0 || x > props.width || y > props.height) return;
      setIsPainting(true);
      prevPosition.current = new PIXI.Point(x, y);
    };

    const onPointerMove = (e: PIXI.FederatedPointerEvent) => {
      const { x, y } = viewport?.toWorld(e.global) ?? e.global;
      if (x < 0 || y < 0 || x > props.width || y > props.height) return;
      currPosition.current = new PIXI.Point(x, y);
      if (!context) return;
      if(!prevPosition.current) return;
      if (isPainting) {
        if (brushMode == 'eraser') {
          context.globalCompositeOperation = 'destination-out';
        } else {
          context.globalCompositeOperation = 'source-over';
          context.fillStyle = color;
        }

        if (currPosition.current == prevPosition.current) {
          let x = Math.round(prevPosition.current.x - brushSize / 2);
          let y = Math.round(prevPosition.current.y - brushSize / 2);
          context.fillRect(x, y, brushSize, brushSize);
          sprite.texture.update();
          return [[x, y]];
        }

        let coords = [];
        let dist = distanceBetween(prevPosition.current, currPosition.current);
        let angle = angleBetween(prevPosition.current, currPosition.current);
        for (let i = 0; i < dist; i++) {
          let x = Math.round(
            prevPosition.current.x + Math.sin(angle) * i - brushSize / 2,
          );
          let y = Math.round(
            prevPosition.current.y + Math.cos(angle) * i - brushSize / 2,
          );
          context.fillRect( x, y, brushSize, brushSize);
          coords.push([x, y]);
        }
        sprite.texture.update();
        prevPosition.current = currPosition.current;
        console.log(coords);
      }
    };

    const onPointerUp = (e: PIXI.FederatedPointerEvent) => {
      setIsPainting(false);
    };
    viewport?.on('pointerdown', onPointerDown);
    viewport?.on('pointerup', onPointerUp);
    viewport?.on('pointermove', onPointerMove);
    return () => {
      viewport?.off('pointerdown', onPointerDown);
      viewport?.off('pointerup', onPointerUp);
      viewport?.off('pointermove', onPointerMove);
    };
  }, [app, brushMode, brushSize, color, context, isPainting, props.height, props.width, sprite.texture, viewport]);

  useEffect(() => {
    if (!context) return;

    context.clearRect(0, 0, props.width, props.height);

    let imageData = context.getImageData(0, 0, props.width, props.height);

    let data = imageData.data;
    for (let i = 0; i < annotation.length; i++) {
      if (annotation[i] >= 0) {
        const color = colors[annotation[i] % colors.length];
        const rgb = hexToRgb(color);
        data[i * 4] = rgb?.r ?? 0;
        data[i * 4 + 1] = rgb?.g ?? 0;
        data[i * 4 + 2] = rgb?.b ?? 0;
        data[i * 4 + 3] = 255;
      }
    }
    context.putImageData(imageData, 0, 0);
    sprite.texture.update();
  }, [
    context,
    canvas,
    colors,
    sprite.texture,
    width,
    height,
    annotation,
    props.width,
    props.height,
  ]);

  const distanceBetween = (point1: PIXI.Point, point2: PIXI.Point) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2),
    );
  };

  const angleBetween = (point1: PIXI.Point, point2: PIXI.Point) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={sprite.texture}
      blendMode={PIXI.BLEND_MODES.OVERLAY}
    />
  );
};

export default Annotation;
