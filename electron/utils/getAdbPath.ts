import { extraResolve } from './extraResolve';

/**
 * Get the path of adb binary.
 */
export function getAdbPath() {
  switch (process.platform) {
    case 'win32':
      return extraResolve(`win/scrcpy/adb.exe`);
    case 'darwin':
      return extraResolve(`mac/scrcpy/adb`);
  }
}
