'use client';

import { useStoreActions } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { Container as PixiContainer } from '@pixi/display';
import { PixiComponent, useApp } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';
import React, { forwardRef } from 'react';

export interface ViewportProps {
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  height?: number;
  setViewport: (viewport: PixiViewport) => void;
  width?: number;
}

export const PixiComponentViewport = PixiComponent('Viewport', {
  applyProps: (instance, _, props) => {
    // update viewport screen if the app screen changes
    instance.resize(props.app.screen.width, props.app.screen.height);
    props.setViewport(instance);
  },
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      events: props.app.renderer.events,
      ticker: props.app.ticker,
    });
    viewport
      .drag({ mouseButtons: 'middle' })
      .pinch()
      .wheel()
      .decelerate()
      .clampZoom({
        maxHeight: 10000,
        maxWidth: 10000,
        minHeight: 1,
        minWidth: 1,
      });

    props.setViewport(viewport);
    return viewport;
  },
  willUnmount: (instance: PixiViewport, parent: PixiContainer) => {
    // workaround because the ticker is already destroyed by this point by the stage
    instance.options.noTicker = true;
    instance.destroy({ baseTexture: true, children: true, texture: true });
  },
});

const Viewport = forwardRef(function Viewport(
  props: ViewportProps,
  ref: React.Ref<PixiViewport>,
) {
  const app = useApp();
  const [width, height] = useWindowSize();
  const { setViewport } = useStoreActions();

  return (
    <PixiComponentViewport
      app={app}
      height={height}
      ref={ref}
      setViewport={setViewport}
      width={width}
      {...props}
    />
  );
});

export default Viewport;
