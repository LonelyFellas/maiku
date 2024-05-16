import { useSize } from '@darwish/hooks-core';

const useScreens = () => {
  const { width } = useSize();

  let size = 'lg';
  if (width < 640) {
    size = 'sm';
  } else if (width < 768) {
    size = 'md';
  } else if (width < 1024) {
    size = 'lg';
  } else if (width < 1280) {
    size = 'xl';
  } else {
    size = '2xl';
  }
  return size;
};
export default useScreens;
