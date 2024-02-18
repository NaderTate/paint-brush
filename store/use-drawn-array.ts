import { create } from "zustand";
interface DrawnArrayStore {
  drawnArray: DrawnArray[];
  setDrawnArray: (drawnArray: DrawnArray[]) => void;
  clearDrawnArray: () => void;
}
export const useDrawnArray = create<DrawnArrayStore>((set) => ({
  drawnArray: [],
  setDrawnArray: (drawnArray: DrawnArray[]) => set({ drawnArray }),
  clearDrawnArray: () => set({ drawnArray: [] }),
}));
