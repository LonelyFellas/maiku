import React from 'react';
import { isMacFunc } from '@common';
import { MacScrollbar, type MacScrollbarProps } from 'mac-scrollbar';

interface ScrollBar extends MacScrollbarProps {
  children: React.ReactNode;
  className: string;
  onClick?: Darwish.AnyFunc;

  [p: string]: any;
}

const ScrollBar = (props: ScrollBar): JSX.Element => {
  const { children, className, onClick } = props;
  const isMac = isMacFunc();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return !isMac ? MacScrollbar :
    <div className={className} onClick={onClick}>{children}</div>;
};

export default ScrollBar;
