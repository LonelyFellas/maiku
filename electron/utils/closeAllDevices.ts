import { scrcpyProcessObj } from '../main';
import { isMac } from './helper';
import { killProcessWithWindows } from './killProcessWithWindows';

/**
 * 关闭所有的云机设备（scrcpy窗口）
 */
export function closeAllScrcpyDevices() {
  Object.entries(scrcpyProcessObj).forEach(([pid, process]) => {
    if (isMac) {
      process.kill('SIGTERM');
    } else {
      killProcessWithWindows(process.pid!);
      delete scrcpyProcessObj[pid];
    }
  });
}
