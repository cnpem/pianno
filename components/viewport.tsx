"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { Container as PixiContainer } from "@pixi/display";

export interface ViewportProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

export const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      // screenWidth: props.app.screen.width,
      // screenHeight: props.app.screen.height,
      // worldWidth: props.width ? props.width * 2 : 2000,
      // worldHeight: props.height ? props.height * 2 : 2000,
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

    return viewport;
  },
  didMount: () => {
    console.log("montei porra");
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
  return <PixiComponentViewport ref={ref} app={app} {...props} />;
});

export default Viewport;
