'use client';

import { useStoreActions } from '@/hooks/use-store';
import { useWindowSize } from '@/hooks/use-window-size';
import { Container as PixiContainer } from '@pixi/display';
import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { forwardRef } from 'react';

export interface ViewportProps {
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  setViewport: (viewport: PixiViewport) => void;
  width?: number;
  height?: number;
}

export const PixiComponentViewport = PixiComponent('Viewport', {
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      ticker: props.app.ticker,
      events: props.app.renderer.events,
    });
    viewport
      .drag({ mouseButtons: 'middle' })
      .pinch()
      .wheel()
      .decelerate()
      .clampZoom({
        minWidth: 1,
        minHeight: 1,
        maxWidth: 10000,
        maxHeight: 10000,
      });

    props.setViewport(viewport);
    return viewport;
  },
  applyProps: (instance, _, props) => {
    // update viewport screen if the app screen changes
    instance.resize(props.app.screen.width, props.app.screen.height);
    props.setViewport(instance);
  },
  willUnmount: (instance: PixiViewport, parent: PixiContainer) => {
    // workaround because the ticker is already destroyed by this point by the stage
    instance.options.noTicker = true;
    instance.destroy({ children: true, texture: true, baseTexture: true });
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
      ref={ref}
      app={app}
      setViewport={setViewport}
      width={width}
      height={height}
      {...props}
    />
  );
});

export default Viewport;
