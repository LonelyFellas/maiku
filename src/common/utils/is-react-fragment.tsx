import { Fragment } from 'react';

export default function isReactFragment(element: JSX.Element): boolean {
  try {
    return element.type === Fragment;
  } catch (e) {
    return false;
  }
}
