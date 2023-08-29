"use client";

import React, { forwardRef } from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Container as PixiContainer } from "@pixi/display";
import { useStoreActions } from "@/hooks/use-store";

export interface ViewportProps {
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  setViewport: (viewport: PixiViewport) => void;
}

export const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      ticker: props.app.ticker,
      events: props.app.renderer.events,
    });
    viewport
      .drag({ mouseButtons: "middle" })
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
  ref: React.Ref<PixiViewport>
) {
  const app = useApp();
  const { setViewport } = useStoreActions();

  return (
    <PixiComponentViewport
      ref={ref}
      app={app}
      setViewport={setViewport}
      {...props}
    />
  );
});

export default Viewport;
