import { create } from 'zustand';

interface UseUpdateState {
  isUpdate: boolean;
}

interface UseUpdateDispatch {
  setIsUpdate: (value: boolean) => void;
}

export const useUpdate = create<UseUpdateState & UseUpdateDispatch>()((set) => ({
  isUpdate: false,
  setIsUpdate: (value) => set(() => ({ isUpdate: value })),
}));
