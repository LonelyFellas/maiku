import { create } from 'zustand';

interface UseUpdateState {
  isUpdate: boolean;
}

interface UseUpdateDispatch {
  setIsUpdate: (value: boolean) => void;
}

/**
 * 版本更新的一些状态
 */
export const useUpdate = create<UseUpdateState & UseUpdateDispatch>()((set) => ({
  isUpdate: false,
  setIsUpdate: (value) => set(() => ({ isUpdate: value })),
}));
