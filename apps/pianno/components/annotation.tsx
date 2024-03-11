'use client';

import {
  useStoreActions,
  useStoreBrushParams,
  useStoreCurrentColor,
  useStoreLabel,
  useStoreViewport,
} from '@/hooks/use-store';
import { angleBetween, distanceBetween } from '@/lib/utils';
import { Sprite, useApp } from '@pixi/react';
import * as PIXI from 'pixi.js';
import React, { useEffect, useMemo, useRef } from 'react';

type AnnotationProps = {
  height: number;
  width: number;
};

const useCanvas = ({ height, width }: AnnotationProps) => {
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
      canvasRef.current = null;
    };
  }, [height, width]);
  return canvasRef;
};

const Annotation = (props: AnnotationProps) => {
  const canvasRef = useCanvas({ height: props.height, width: props.width });

  const color = useStoreCurrentColor();
  const label = useStoreLabel();
  const { mode: brushMode, size: brushSize } = useStoreBrushParams();
  const { setLabel } = useStoreActions();

  const canvas = canvasRef.current;
  const context = canvas?.getContext('2d');
  const sprite = useMemo(
    () => PIXI.Sprite.from(canvas ?? PIXI.Texture.EMPTY),
    [canvas],
  );

  useEffect(() => {
    if (!context) return;
    const img = new Image();
    img.src = label;
    img.onload = () => {
      context.clearRect(0, 0, props.width, props.height);
      context.drawImage(img, 0, 0);
      sprite.texture.update();
    };
  }, [label, context, sprite.texture, props.width, props.height]);

  const prevPosition = useRef<PIXI.Point | null>(null);
  const currPosition = useRef<PIXI.Point | null>(null);

  const viewport = useStoreViewport();
  const app = useApp();

  const [isPainting, setIsPainting] = React.useState(false);

  useEffect(() => {
    const onPointerDown = (e: PIXI.FederatedPointerEvent) => {
      if (brushMode === 'drag') return;

      if (!context) return;
      context.fillStyle = color;
      if (e.pointerType === 'mouse') {
        // only allow left click to paint
        if (e.button !== 0) return;
      }

      if (!viewport) return;
      // delay to ensure the first touch doesn't trigger a paint if the user is pinching
      setTimeout(() => {
        const pinch = viewport.plugins.get('pinch');

        if (pinch?.active || pinch?.pinching) return;

        if (!context) return;
        context.fillStyle = color;
        setIsPainting(true);

        viewport?.plugins.pause('drag');
        const pos = viewport?.toWorld(e.global) ?? e.global;
        prevPosition.current = pos;

        const x = Math.round(prevPosition.current.x - brushSize / 2);
        const y = Math.round(prevPosition.current.y - brushSize / 2);
        if (brushMode === 'eraser') {
          context.clearRect(x, y, brushSize, brushSize);
        } else if (brushMode === 'pen') {
          context.fillRect(x, y, brushSize, brushSize);
        }
        sprite.texture.update();
      }, 0);
    };

    const onPointerMove = (e: PIXI.FederatedPointerEvent) => {
      const pos = viewport?.toWorld(e.global) ?? e.global;
      currPosition.current = pos;
      if (!context) return;
      if (!prevPosition.current) return;
      if (isPainting) {
        const dist = distanceBetween(
          prevPosition.current,
          currPosition.current,
        );
        const angle = angleBetween(prevPosition.current, currPosition.current);
        for (let i = 0; i < dist; i++) {
          const x = Math.round(
            prevPosition.current.x + Math.sin(angle) * i - brushSize / 2,
          );
          const y = Math.round(
            prevPosition.current.y + Math.cos(angle) * i - brushSize / 2,
          );
          if (brushMode === 'eraser') {
            context.clearRect(x, y, brushSize, brushSize);
          }
        }
        sprite.texture.update();
        prevPosition.current = currPosition.current;
      }
    };

    const onPointerUp = (e: PIXI.FederatedPointerEvent) => {
      if (!canvas) return;
      setIsPainting(false);
      viewport?.plugins.resume('drag');
      setLabel(canvas.toDataURL());
    };

    app.stage.on('pointerdown', onPointerDown);
    app.stage.on('pointermove', onPointerMove);
    app.stage.on('pointerup', onPointerUp);
    return () => {
      app.stage.off('pointerdown', onPointerDown);
      app.stage.off('pointermove', onPointerMove);
      app.stage.off('pointerup', onPointerUp);
    };
  }, [
    app.stage,
    brushMode,
    brushSize,
    canvas,
    color,
    context,
    isPainting,
    setLabel,
    sprite.texture,
    viewport,
  ]);

  return (
    <Sprite blendMode={PIXI.BLEND_MODES.OVERLAY} texture={sprite.texture} />
  );
};

export default Annotation;
