import { scrcpyProcessObj, pyProcessObj } from '../main';
import { killProcessWithWindows } from './killProcessWithWindows';

/**
 * 关闭所有的云机设备（scrcpy窗口）
 */
export function closeAllScrcpyDevices() {
  Object.entries(scrcpyProcessObj).forEach(([pid, process]) => {
    killProcessWithWindows(process.pid!);
    delete scrcpyProcessObj[pid];
  });
  Object.entries(pyProcessObj).forEach(([pid, process]) => {
    killProcessWithWindows(process.pid!);
    delete scrcpyProcessObj[pid];
  });
}
