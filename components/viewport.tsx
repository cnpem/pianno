"use client";

import React, { forwardRef } from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { EventSystem } from "@pixi/events";
import { Container as PixiContainer } from "@pixi/display";

export interface ViewportProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    // comes from github issue: https://github.com/davidfig/pixi-viewport/issues/438
    // Install EventSystem, if not already
    // (PixiJS 6 doesn't add it by default)

    const events = new EventSystem(props.app.renderer);
    events.domElement = props.app.renderer.view as any;

    const viewport = new PixiViewport({
      screenWidth: props.app.screen.width,
      screenHeight: props.app.screen.height,
      worldWidth: props.width * 2,
      worldHeight: props.height * 2,
      ticker: props.app.ticker,
      events: events,
    });
    viewport.drag().pinch().wheel().clampZoom({
      minWidth: 1,
      minHeight: 1,
      maxWidth: 10000,
      maxHeight: 10000,
    });

    return viewport;
  },

  willUnmount: (instance: PixiViewport, parent: PixiContainer) => {
    // workaround because the ticker is already destroyed by this point by the stage
    instance.options.noTicker = true;
    instance.destroy({ children: true, texture: true, baseTexture: true });
  },
});

const Viewport = forwardRef(
  (props: ViewportProps, ref: React.Ref<PixiViewport>) => {
    const app = useApp();
    return <PixiComponentViewport ref={ref} app={app} {...props} />;
  }
);

Viewport.displayName = "Viewport";

export default Viewport;
