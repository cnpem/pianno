'use client';

import { type State, type Store, createStore } from '@/store';
import { type ReactNode, createContext, useContext, useRef } from 'react';
import { type TemporalState } from 'zundo';
import { useStore as useZustandStore } from 'zustand';

export const StoreContext = createContext<ReturnType<
  typeof createStore
> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createStore>>();
  if (!storeRef.current) {
    storeRef.current = createStore();
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = <T,>(selector: (state: Store) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return useZustandStore(store, selector);
};

export const useTemporalStore = <T,>(
  selector: (state: TemporalState<Partial<State>>) => T,
): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useTemporalStore must be used within a StoreProvider');
  }
  return useZustandStore(store.temporal, selector);
};
