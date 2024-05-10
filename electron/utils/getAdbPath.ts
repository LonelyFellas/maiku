import { extraResolve } from "./extraResolve";

/**
 * Get the path of adb binary.
 */
export function getAdbPath() {
  switch (process.platform) {
    case 'win32':
      return extraResolve(`win/android-platform-tools/adb.exe`)
    case 'darwin':
      return extraResolve(`mac/android-platform-tools/adb`)
  }
}