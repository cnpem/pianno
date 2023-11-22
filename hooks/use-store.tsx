'use client';

import type { BrushMode } from '@/lib/types';

import { COLORS } from '@/lib/constants';
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

type State = {
  brushMode: BrushMode;
  brushSize: number;
  colors: string[];
  currentColor: string;
  img: Image;
  label: string; // dataUrl
  toggled: boolean;
  viewport: Viewport | null;
};

type Actions = {
  recenterViewport: (width: number, height: number) => void;
  reset: () => void;
  resetLabel: () => void;
  setBrushMode: (mode: BrushMode) => void;
  setBrushSize: (size: number) => void;
  setColor: (color: string) => void;
  setImage: (img: Image) => void;
  setLabel: (label: string) => void;
  setViewport: (viewport: Viewport) => void;
  toggle: () => void;
};

type Store = State & {
  actions: Actions;
};

const initialState: State = {
  brushMode: 'pen',
  brushSize: 1,
  colors: COLORS,
  currentColor: COLORS[0],
  img: {
    height: 0,
    src: '#',
    width: 0,
  },
  label: 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=', // 1x1 transparent png
  toggled: false,
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
          resetLabel: () => set({ label: initialState.label }),
          setBrushMode: (brushMode) => set({ brushMode }),
          setBrushSize: (brushSize) => set({ brushSize }),
          setColor: (color) => set({ currentColor: color }),
          setImage: (img) => set({ img }),
          setLabel: (label) => set({ label }),
          setViewport: (viewport) => set({ viewport }),
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
        brushMode: state.brushMode,
        brushSize: state.brushSize,
        currentColor: state.currentColor,
        img: state.img,
        label: state.label,
      }),
    },
  ),
);

export const useTemporalStore = <T,>(
  selector: (state: TemporalState<Partial<State>>) => T,
) => useZustandStore(useStore.temporal, selector);

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreBrushMode = () => useStore((state) => state.brushMode);
export const useStoreColors = () => useStore((state) => state.colors);
export const useStoreCurrentColor = () =>
  useStore((state) => state.currentColor);
export const useStoreImg = () => useStore((state) => state.img);
export const useStoreToggled = () => useStore((state) => state.toggled);
export const useStoreBrushSize = () => useStore((state) => state.brushSize);
export const useStoreLabel = () => useStore((state) => state.label);
export const useStoreActions = () => useStore((state) => state.actions);
