import { create } from "zustand";
import { type Viewport } from "pixi-viewport";

export type BrushMode = "pen" | "eraser" | "grab";
type State = {
  viewport: Viewport | null;
  brushMode: 'pen' | 'eraser' | 'grab';
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
  setBrushMode: (mode: 'pen' | 'eraser' | 'grab') => void;
};

type Store = State & {
  actions: Actions;
};

const initialState: State = {
  viewport: null,
  brushMode: 'pen',
};

const useStore = create<Store>()((set) => ({
  ...initialState,
  actions: {
    setViewport: (viewport) => set({ viewport }),
    setBrushMode: (brushMode) => set({ brushMode }),
  },
}));

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreBrushMode = () => useStore((state) => state.brushMode);
export const useStoreActions = () => useStore((state) => state.actions);
