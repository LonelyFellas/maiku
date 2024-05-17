import { create } from 'zustand';

interface ScrcpyRecordState {
  data: Map<string, number>;
}

interface ScrcpyRecordDispatch {
  setData: (value: Map<string, number>) => void;
}

/**
 * scrcpy-record store
 */
export const useScrcpyRecord = create<ScrcpyRecordState & ScrcpyRecordDispatch>()((set) => ({
  data: new Map(),
  setData: (value) => set(() => ({ data: value })),
}));
