import { create } from 'zustand';

interface ScrcpyRecordState {
  data: Map<string, string>;
}

interface ScrcpyRecordDispatch {
  setData: (value: Map<string, string>) => void;
}

export const useScrcpyRecord = create<ScrcpyRecordState & ScrcpyRecordDispatch>()((set) => ({
  data: new Map(),
  setData: (value) => set(() => ({ data: value })),
}));
