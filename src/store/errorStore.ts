import { create } from "zustand";

interface State {
  message: string;
}

export const useErrorStore = create((set) => ({
  message: "",
  setMessage: (message: string) => set(() => message),

  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}));
