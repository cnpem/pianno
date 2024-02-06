'use client';

import type { Brush } from '@/lib/types';

import { annotationColorPallete } from '@/lib/constants';
import { type Viewport } from 'pixi-viewport';
import { type TemporalState, temporal } from 'zundo';
import { create, useStore as useZustandStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

type Image = {
  height: number;
  src: string;
  width: number;
};

type ImageMetadata = {
  name: string;
  size: number;
  type: string;
};

type State = {
  brush: Brush;
  colors: typeof annotationColorPallete;
  currentColor: string;
  img: Image;
  imgMetadata: ImageMetadata;
  label: string; // dataUrl
  toggled: boolean;
  viewport: Viewport | null;
};

type Actions = {
  recenterViewport: (width: number, height: number) => void;
  reset: () => void;
  setBrushMode: (mode: Brush['mode']) => void;
  setBrushSize: (size: number) => void;
  setColor: (color: string) => void;
  setImage: (img: Image) => void;
  setImageMetadata: (metadata: ImageMetadata) => void;
  setLabel: (label: string) => void;
  setNewColor: (
    color: string,
    colorLabel: keyof typeof annotationColorPallete,
  ) => void;
  setViewport: (viewport: Viewport) => void;
  softReset: () => void;
  toggle: () => void;
};

type Store = State & {
  actions: Actions;
};

const initialState: State = {
  brush: {
    eraserSize: 5,
    maxSize: 10,
    mode: 'pen',
    penSize: 1,
  },
  colors: annotationColorPallete,
  currentColor: annotationColorPallete.euclidean[0],
  img: {
    height: 0,
    src: '#',
    width: 0,
  },
  imgMetadata: {
    name: '',
    size: 0,
    type: '',
  },
  label: 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=', // 1x1 transparent png
  toggled: true,
  viewport: null,
};

const useStore = create<Store>()(
  persist(
    temporal(
      (set, get) => ({
        ...initialState,
        actions: {
          recenterViewport: (width, height) => {
            const viewport = get().viewport;
            viewport?.moveCenter(width / 2, height / 2);
            viewport?.fit(true, width, height);
          },
          reset: () => {
            set(initialState);
            // force reload to reset viewport
            window.location.reload();
          },
          setBrushMode: (mode) => {
            const brush = get().brush;
            set({ brush: { ...brush, mode } });
          },
          setBrushSize: (brushSize) => {
            const brush = get().brush;
            if (brush.mode === 'eraser') {
              set({ brush: { ...brush, eraserSize: brushSize } });
            } else if (brush.mode === 'pen') {
              set({ brush: { ...brush, penSize: brushSize } });
            }
          },
          setColor: (color) => set({ currentColor: color }),
          setImage: (img) => {
            set({ img });
            const { height, width } = img;
            if (height && width) {
              const maxSize = Math.floor(Math.max(height, width) * 0.04);
              const eraserSize = Math.floor(maxSize / 2);
              const brush = get().brush;
              set({ brush: { ...brush, eraserSize, maxSize } });
            }
          },
          setImageMetadata: (metadata) => set({ imgMetadata: metadata }),
          setLabel: (label) => set({ label }),
          setNewColor: (color, colorLabel) => {
            const colors = get().colors;
            // check if the color already exists in one of the color arrays
            const colorExists = Object.values(colors).some((colorArr) =>
              colorArr.includes(color),
            );
            // if it does, don't add it
            if (colorExists) return;
            const newColors = {
              ...colors,
              [colorLabel]: [...colors[colorLabel], color],
            };
            set({ colors: newColors });
            set({ currentColor: color });
          },
          setViewport: (viewport) => set({ viewport }),
          softReset: () => {
            // reset label and colors
            set({ colors: initialState.colors, label: initialState.label });
          },
          toggle: () => set((state) => ({ toggled: !state.toggled })),
        },
      }),
      {
        equality: shallow,
        partialize: (state) => ({
          label: state.label,
        }),
      },
    ),
    {
      name: 'store',
      partialize: (state) => ({
        brush: state.brush,
        colors: state.colors,
        currentColor: state.currentColor,
        imgMetadata: state.imgMetadata,
        // img: state.img,
        label: state.label,
      }),
    },
  ),
);

export const useTemporalStore = <T,>(
  selector: (state: TemporalState<Partial<State>>) => T,
) => useZustandStore(useStore.temporal, selector);

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
