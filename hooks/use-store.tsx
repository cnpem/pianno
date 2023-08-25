import { create } from "zustand";
import { type Viewport } from "pixi-viewport";
import { persist } from "zustand/middleware";

export type BrushMode = "pen" | "eraser" | "grab";
type Color = [number, number, number];
type State = {
  viewport: Viewport | null;
  brushMode: "pen" | "eraser" | "grab";
  colors: Color[];
  currentColor: Color;
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
  setBrushMode: (mode: "pen" | "eraser" | "grab") => void;
  setColor: (color: Color) => void;
  reset: () => void;
};

type Store = State & {
  actions: Actions;
};

const colors: Color[] = [
  [255, 0, 0],
  [0, 0, 255],
  [255, 255, 0],
  [255, 0, 255],
  [0, 128, 0],
  [75, 0, 130],
  [255, 140, 0],
  [0, 255, 255],
  [255, 192, 203],
  [154, 205, 50],
];

const initialState: State = {
  viewport: null,
  brushMode: "pen",
  colors,
  currentColor: colors[0],
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        setViewport: (viewport) => set({ viewport }),
        setBrushMode: (brushMode) => set({ brushMode }),
        setColor: (color) => set({ currentColor: color }),
        reset: () => set(initialState),
      },
    }),
    {
      name: "store",
      // storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ brushMode: state.brushMode }),
    }
  )
);

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreBrushMode = () => useStore((state) => state.brushMode);
export const useStoreColors = () => useStore((state) => state.colors);
export const useStoreCurrentColor = () =>
  useStore((state) => state.currentColor);
export const useStoreActions = () => useStore((state) => state.actions);
