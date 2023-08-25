import { create } from "zustand";
import { type Viewport } from "pixi-viewport";
import { persist } from "zustand/middleware";

export type BrushMode = "pen" | "eraser" | "grab";
type Color = [number, number, number];
type Image = {
  width: number;
  height: number;
  src: string;
};

type State = {
  viewport: Viewport | null;
  brushMode: "pen" | "eraser" | "grab";
  colors: Color[];
  currentColor: Color;
  img: Image;
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
  recenterViewport: (width: number, height: number) => void;
  setBrushMode: (mode: "pen" | "eraser" | "grab") => void;
  setColor: (color: Color) => void;
  setImage: (img: Image) => void;
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
  img: {
    width: 0,
    height: 0,
    src: "#",
  },
};

const useStore = create<Store>()(
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
        setImage: (img) => set({ img }),
        reset: () => {
          const { viewport: _, ...filteredState } = initialState;
          set({ viewport: get().viewport, ...filteredState });
        },
      },
    }),
    {
      name: "store",
      // storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ brushMode: state.brushMode, img: state.img }),
    }
  )
);

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreBrushMode = () => useStore((state) => state.brushMode);
export const useStoreColors = () => useStore((state) => state.colors);
export const useStoreCurrentColor = () =>
  useStore((state) => state.currentColor);
export const useStoreImg = () => useStore((state) => state.img);
export const useStoreActions = () => useStore((state) => state.actions);