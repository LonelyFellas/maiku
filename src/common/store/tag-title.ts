import { create } from 'zustand';

interface UseTagTitle {
  tagTitle: {
    title: string;
    url: string;
    prevUrl?: string;
    isBack?: boolean;
  };
  setTagTitle: (data: UseTagTitle['tagTitle']) => void;
}

const useTagTitle = create<UseTagTitle>()((set) => ({
  tagTitle: {
    title: '',
    url: '/',
    prevUrl: '/',
  },
  setTagTitle: (data) => set(() => ({ tagTitle: data })),
}));
export default useTagTitle;
