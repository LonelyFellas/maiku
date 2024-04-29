import BGSVG from '@img/bg.svg?inline';
import BGLIGHTJPG from '@img/bg-light.jpg?inline';
import { isMacFunc } from '@common';

interface BgWrapperProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function BgWrapper(
  props: React.PropsWithChildren<BgWrapperProps>,
) {
  const isMac = isMacFunc();
  return (
    <div
      className="w-full absolute inset-0 top-[30px] bottom-10 bg-bottom bg-no-repeat bg-slate-50 dark:bg-[#0B1120]"
      style={{
        backgroundImage: `url(${BGLIGHTJPG})`,
        top: isMac ? '0px' : '30px',
        height: isMac ? '100%' : 'calc(100% - 30px)',
      }}
    >
      <div
        className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
          backgroundImage: `url(${BGSVG})`,
        }}
      ></div>
      <div className={props.className} style={props.style}>
        {props.children}
      </div>
    </div>
  );
}
