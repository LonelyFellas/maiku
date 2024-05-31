import { create } from 'zustand';

interface UseDeviceToastState {
  toastRecord: Record<string, boolean>;
}

interface UseDeviceDispatch {
  setToastRecord: (value: Record<string, boolean>) => void;
}

/**
 * 版本更新的一些状态
 */
export const useDeviceToast = create<UseDeviceToastState & UseDeviceDispatch>()((set) => ({
  toastRecord: {},
  setToastRecord: (value) =>
    set((state) => ({
      ...state,
      toastRecord: {
        ...state.toastRecord,
        ...value,
      },
    })),
}));
