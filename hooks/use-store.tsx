'use client';

import type { Annotation, BrushMode } from '@/lib/types';

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
  annotation: Annotation[];
  brushMode: BrushMode;
  brushSize: number;
  colors: string[];
  currentColor: string;
  img: Image;
  label: string; // dataUrl
  viewport: Viewport | null;
};

type Actions = {
  addAnnotation: (annotation: Annotation) => void;
  recenterViewport: (width: number, height: number) => void;
  removeAnnotation: (position: { x: number; y: number }) => void;
  reset: () => void;
  resetAnnotation: () => void;
  resetLabel: () => void;
  setAnnotation: (annotation: Annotation[]) => void;
  setBrushMode: (mode: BrushMode) => void;
  setBrushSize: (size: number) => void;
  setColor: (color: string) => void;
  setImage: (img: Image) => void;
  setLabel: (label: string) => void;
  setViewport: (viewport: Viewport) => void;
};

type Store = State & {
  actions: Actions;
};

const initialState: State = {
  annotation: [],
  brushMode: 'pen',
  brushSize: 10,
  colors: COLORS,
  currentColor: COLORS[0],
  img: {
    height: 0,
    src: '#',
    width: 0,
  },
  label: 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=', // 1x1 transparent png
  viewport: null,
};

const useStore = create<Store>()(
  persist(
    temporal(
      (set, get) => ({
        ...initialState,
        actions: {
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
          recenterViewport: (width, height) => {
            const viewport = get().viewport;
            viewport?.moveCenter(width / 2, height / 2);
            viewport?.fit(true, width, height);
          },
          removeAnnotation: (position) => {
            const annotations = get().annotation;
            const index = annotations.findIndex(
              (a) => a.x === position.x && a.y === position.y,
            );
            if (index !== -1) {
              set((state) => {
                const annotation = [...annotations];
                annotation.splice(index, 1);
                if (index % 2 === 1) {
                  const pairIndex = index - 1;
                  if (annotation.length > 1)
                    annotation.push(annotation.splice(pairIndex, 1)[0]);
                } else if (index !== annotations.length - 1) {
                  annotation.push(annotation.splice(index, 1)[0]);
                }
                return { ...state, annotation };
              });
            }
          },
          reset: () => {
            set(initialState);
            // force reload to reset viewport
            window.location.reload();
          },
          resetAnnotation: () => set({ annotation: initialState.annotation }),
          resetLabel: () => set({ label: initialState.label }),
          setAnnotation: (annotation) => set({ annotation }),
          setBrushMode: (brushMode) => set({ brushMode }),
          setBrushSize: (brushSize) => set({ brushSize }),
          setColor: (color) => set({ currentColor: color }),
          setImage: (img) => set({ img }),
          setLabel: (label) => set({ label }),
          setViewport: (viewport) => set({ viewport }),
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
export const useStoreBrushSize = () => useStore((state) => state.brushSize);
export const useStoreLabel = () => useStore((state) => state.label);
export const useStoreAnnotation = () => useStore((state) => state.annotation);
export const useStoreActions = () => useStore((state) => state.actions);
