import { create } from 'zustand';

interface UseDeviceToastState {
  toastRecord: Record<string, boolean>;
  filesRecord: Record<string, boolean>;
}

interface UseDeviceDispatch {
  setToastRecord: (value: Record<string, boolean>) => void;
  setFilesRecord: (value: Record<string, boolean>) => void;
}

/**
 * scrcpy扩展页面的状态
 */
export const useDeviceToast = create<UseDeviceToastState & UseDeviceDispatch>()((set) => ({
  toastRecord: {},
  filesRecord: {},
  setToastRecord: (value) =>
    set((state) => ({
      ...state,
      toastRecord: {
        ...state.toastRecord,
        ...value,
      },
    })),
  setFilesRecord: (value) =>
    set((state) => ({
      ...state,
      filesRecord: {
        ...state.filesRecord,
        ...value,
      },
    })),
}));
