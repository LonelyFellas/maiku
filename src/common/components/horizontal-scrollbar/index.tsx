import { MacScrollbar } from 'mac-scrollbar';
import { useEffect, useRef } from 'react';
import { isMacFunc } from '@common';

interface HorizontalScrollbarProps {
  className: string;
}

/**
 * 手表滑轮横向滚动表格组件
 * @param props
 * @returns
 */
const HorizontalScrollbar = (
  props: React.PropsWithChildren<HorizontalScrollbarProps>,
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMac = isMacFunc();
  useEffect(() => {
    // if (isMac) return;
    // const handleMoveSize = (e: WheelEvent) => {
    //   e.preventDefault();
    //   if (scrollRef.current) {
    //     scrollRef.current.scrollLeft += e.deltaY;
    //   }
    // };
    // if (scrollRef.current) {
    //   scrollRef.current.addEventListener('wheel', handleMoveSize);
    // }
    // return () => {
    //   if (scrollRef.current) {
    //     scrollRef.current.removeEventListener('wheel', handleMoveSize);
    //   }
    // };
  }, []);
  return (
    <MacScrollbar
      suppressAutoHide={false}
      ref={scrollRef}
      className={props.className}
    >
      {props.children}
    </MacScrollbar>
  );
};
export default HorizontalScrollbar;
