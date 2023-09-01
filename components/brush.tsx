'use client';

import {
  useStoreBrushSize,
  useStoreCurrentColor,
  useStoreViewport,
} from '@/hooks/use-store';
import { Graphics, useApp } from '@pixi/react';
import throttle from 'lodash.throttle';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';

export const Brush = () => {
  const color = useStoreCurrentColor();

  const size = useStoreBrushSize();
  const [pos, setPos] = useState(new PIXI.Point(0, 0));

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(color);
      g.drawRect(0, 0, size, size);
      g.endFill();
    },
    [size, color],
  );
  const app = useApp();
  const viewport = useStoreViewport();
  
  // throttle the pointermove event
  const t = throttle((e: PIXI.FederatedPointerEvent) => {
    const currentPos = viewport?.toWorld(e.global) ?? e.global;
    setPos(new PIXI.Point(currentPos.x - size / 2, currentPos.y - size / 2));
  }, 16);

  const handlePointerMove = useCallback(t, [t]);

  useEffect(() => {
    app.stage.on('pointermove', handlePointerMove);
    return () => {
      app.stage.off('pointermove',handlePointerMove);
    };
  }, [handlePointerMove, app.stage]);

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
