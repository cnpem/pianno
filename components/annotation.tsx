'use client';

import {
  useStoreActions,
  useStoreAnnotation,
  useStoreAnnotationCoords,
  useStoreBrushMode,
  useStoreBrushSize,
  useStoreColors,
  useStoreViewport,
} from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { hexToRgb } from '@/lib/utils';
import { Container, Sprite, useApp } from '@pixi/react';
import * as PIXI from 'pixi.js';
import React, { useCallback, useEffect, useRef } from 'react';

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
    // const annot = Array.from({ length: width * height }, () => -1);
    const annot = Array.from({length: width * height}, () => Math.floor(Math.random() * 10))
    setAnnotation(annot);
  }, [height, setAnnotation, width]);
};

const Annotation = (props: AnnotationProps) => {
  const colors = useStoreColors();
  const app = useApp();
  const canvas = document.createElement('canvas');
  canvas.width = props.width;
  canvas.height = props.height;
  const context = canvas.getContext('2d');
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
    const draw = (annot: number[]) => {
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      let data = imageData.data;
      for (let i = 0; i < annot.length; i++) {
        if (annot[i] >= 0) {
          const color = colors[annot[i] % colors.length];
          const rgb = hexToRgb(color);
          data[i * 4] = rgb?.r ?? 0;
          data[i * 4 + 1] = rgb?.g ?? 0;
          data[i * 4 + 2] = rgb?.b ?? 0;
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
      blendMode={PIXI.BLEND_MODES.MULTIPLY}
    />
  );
};

export default Annotation;
