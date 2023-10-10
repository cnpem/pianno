'use client';

import { COLORS } from '@/lib/constants';
import type { Annotation, BrushMode } from '@/lib/types';
import { type Viewport } from 'pixi-viewport';
import { type TemporalState, temporal } from 'zundo';
import { create, useStore as useZustandStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

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
  annotation: Annotation[];
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
  recenterViewport: (width: number, height: number) => void;
  setBrushMode: (mode: BrushMode) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setImage: (img: Image) => void;
  setLabel: (label: string) => void;
  setAnnotation: (annotation: Annotation[]) => void;
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (annotation: Annotation) => void;
  resetAnnotation: () => void;
  resetLabel: () => void;
  reset: () => void;
};

type Store = State & {
  actions: Actions;
};

const initialState: State = {
  viewport: null,
  brushMode: 'pen',
  colors: COLORS,
  brushSize: 10,
  currentColor: COLORS[0],
  label: 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=', // 1x1 transparent png
  img: {
    width: 0,
    height: 0,
    src: '#',
  },
  annotation: [],
};

const useStore = create<Store>()(
  persist(
    temporal(
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
          setAnnotation: (annotation) => set({ annotation }),
          addAnnotation: (annotation) => {
            //check if annotation already exists
            const annotations = get().annotation;
            const index = annotations.findIndex(
              (a) => a.x === annotation.x && a.y === annotation.y,
            );
            if (index === -1) {
              set((state) => ({
                annotation: [...state.annotation, annotation],
              }));
            } else {
              // update annotation
              set((state) => ({
                annotation: [
                  ...state.annotation.slice(0, index),
                  annotation,
                  ...state.annotation.slice(index + 1),
                ],
              }));
            }
          },
          removeAnnotation: (annotation) => {
            const annotations = get().annotation;
            const index = annotations.findIndex(
              (a) => a.x === annotation.x && a.y === annotation.y,
            );
            if (index !== -1) {
              set((state) => ({
                annotation: [
                  ...state.annotation.slice(0, index),
                  ...state.annotation.slice(index + 1),
                ],
              }));
              // move pair to the end of the array if it exists
              if(index % 2){
                const pairIndex = index - 1;
                set((state) => ({
                  annotation: [
                    ...state.annotation.slice(0, pairIndex),
                    ...state.annotation.slice(pairIndex + 1),
                    state.annotation[pairIndex],
                  ],
                }));
              }
              else if(index%2 === 0  && index !== annotations.length - 1){
                const pairIndex = index + 1;
                set((state) => ({
                  annotation: [
                    ...state.annotation.slice(0, pairIndex),
                    ...state.annotation.slice(pairIndex + 1),
                    state.annotation[pairIndex],
                  ],
                }));
              }
            }
          },
          resetAnnotation: () => set({ annotation: initialState.annotation }),
          resetLabel: () => set({ label: initialState.label }),
          reset: () => {
            set(initialState);
            // force reload to reset viewport
            window.location.reload();
          },
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
        currentColor: state.currentColor,
        img: state.img,
        brushSize: state.brushSize,
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
