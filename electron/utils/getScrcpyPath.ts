import { extraResolve } from '/electron/utils/extraResolve.ts';

export function getScrcpyPath() {
  switch (process.platform) {
    case 'win32':
      return extraResolve(`win/scrcpy/scrcpy.exe`);
    case 'darwin':
      return extraResolve(`mac/scrcpy/scrcpy`);
  }
}

export function getScrcpyCwd() {
  switch (process.platform) {
    case 'win32':
      return extraResolve(`win/scrcpy`);
    case 'darwin':
      return extraResolve(`mac/scrcpy`);
    default:
      return '/electron/resources/extra/win/scrcpy';
  }
}
