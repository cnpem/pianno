'use client';

import { type BrushMode } from '@/lib/types';
import { type Viewport } from 'pixi-viewport';
import { type TemporalState, temporal } from 'zundo';
import { create, useStore as useZustandStore } from 'zustand';
import { persist } from 'zustand/middleware';

type Image = {
  width: number;
  height: number;
  src: string;
};

type State = {
  viewport: Viewport | null;
  brushMode: BrushMode;
  colors: string[];
  currentColor: string;
  brushSize: number;
  label: string; // dataUrl
  img: Image;
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
  recenterViewport: (width: number, height: number) => void;
  setBrushMode: (mode: BrushMode) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setImage: (img: Image) => void;
  setLabel: (label: string) => void;
  reset: () => void;
};

type Store = State & {
  actions: Actions;
};

const colors: string[] = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];

const initialState: State = {
  viewport: null,
  brushMode: 'pen',
  colors,
  brushSize: 10,
  currentColor: colors[0],
  label: '#',
  img: {
    width: 0,
    height: 0,
    src: '#',
  },
};

const useStore = create<Store>()(
  temporal(
    persist(
      (set, get) => ({
        ...initialState,
        actions: {
          setViewport: (viewport) => set({ viewport }),
          recenterViewport: (width, height) => {
            const viewport = get().viewport;
            viewport?.moveCenter(width / 2, height / 2);
            viewport?.fit(true, width, height);
          },
          setBrushMode: (brushMode) => set({ brushMode }),
          setColor: (color) => set({ currentColor: color }),
          setBrushSize: (brushSize) => set({ brushSize }),
          setImage: (img) => set({ img }),
          setLabel: (label) => set({ label }),
          reset: () => {
            const { viewport: _, ...filteredState } = initialState;
            set({ viewport: get().viewport, ...filteredState });
          },
        },
      }),
      {
        name: 'store',
        partialize: (state) => ({
          brushMode: state.brushMode,
          currentColor: state.currentColor,
          img: state.img,
          brushSize: state.brushSize,
          label: state.label,
        }),
      },
    ),
    {
      partialize: (state) => ({
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
export const useStoreBrushSize = () => useStore((state) => state.brushSize);
export const useStoreLabel = () => useStore((state) => state.label);
export const useStoreActions = () => useStore((state) => state.actions);
