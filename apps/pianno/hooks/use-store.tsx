'use client';
import { useStore } from '@/providers/store';

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreColors = () => useStore((state) => state.colors);
export const useStoreCurrentColor = () =>
  useStore((state) => state.currentColor);
export const useStoreImg = () => useStore((state) => state.img);
export const useStoreToggled = () => useStore((state) => state.toggled);
export const useStoreBrushParams = () =>
  useStore((state) => {
    const brush = state.brush;
    if (brush.mode === 'eraser') {
      return { ...brush, size: brush.eraserSize };
    } else if (brush.mode === 'pen') {
      return { ...brush, size: brush.penSize };
    }
    return { ...brush, size: 1 };
  });
export const useStoreLabel = () => useStore((state) => state.label);
export const useStoreActions = () => useStore((state) => state.actions);
export const useStoreImageMetadata = () =>
  useStore((state) => state.imgMetadata);
