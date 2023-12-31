'use client';

import {
  useStoreBrushParams,
  useStoreCurrentColor,
  useStoreViewport,
} from '@/hooks/use-store';
import { Graphics, useApp } from '@pixi/react';
import throttle from 'lodash.throttle';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';

const Pen = () => {
  const color = useStoreCurrentColor();
  const { size } = useStoreBrushParams();
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
      app.stage.off('pointermove', handlePointerMove);
    };
  }, [handlePointerMove, app.stage]);

  return (
    <Graphics
      alpha={0.7}
      blendMode={PIXI.BLEND_MODES.DIFFERENCE}
      draw={draw}
      x={pos.x}
      y={pos.y}
    />
  );
};

const Eraser = () => {
  const color = '#808080';

  const { size } = useStoreBrushParams();
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
      app.stage.off('pointermove', handlePointerMove);
    };
  }, [handlePointerMove, app.stage]);

  return (
    <Graphics
      alpha={0.7}
      blendMode={PIXI.BLEND_MODES.DIFFERENCE}
      draw={draw}
      x={pos.x}
      y={pos.y}
    />
  );
};

const Brush = () => {
  const { mode: brushMode } = useStoreBrushParams();

  if (!brushMode) return null;

  return (
    <>
      {brushMode === 'pen' && <Pen />}
      {brushMode === 'eraser' && <Eraser />}
    </>
  );
};

export default Brush;
