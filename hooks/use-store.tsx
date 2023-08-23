import { create } from "zustand";
import { type Viewport } from "pixi-viewport";
import { shallow } from "zustand/shallow";

type State = {
  viewport: Viewport | null;
};

type Actions = {
  setViewport: (viewport: Viewport) => void;
};

type Store = State & {
  actions: Actions;
};

const useStore = create<Store>()((set) => ({
  viewport: null,
  actions: {
    setViewport: (viewport) => set({ viewport }),
  },
}));

export const useStoreViewport = () => useStore((state) => state.viewport);
export const useStoreActions = () => useStore((state) => state.actions);
