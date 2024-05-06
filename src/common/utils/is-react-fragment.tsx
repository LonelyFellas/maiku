import { Fragment } from 'react';

/**
 * Checks if the given element is a React Fragment.
 * @param element
 */
export default function isReactFragment(element: JSX.Element): boolean {
  try {
    return element.type === Fragment;
  } catch (e) {
    return false;
  }
}
