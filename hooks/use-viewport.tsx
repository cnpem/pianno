import { useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";

export const useViewport = () => {
  const app = useApp();
  const viewport = app.stage.children.find(
    (child) => child instanceof PixiViewport
  ) as PixiViewport;
  return viewport;
};
