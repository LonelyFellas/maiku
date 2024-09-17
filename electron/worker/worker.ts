// worker.js (Worker 线程)
import { parentPort } from 'node:worker_threads';
import { getWindowRect } from '../utils/getActiveWindowRect';

parentPort?.on('message', (message: { task: string; scrcpyWinName: string }) => {
  const { task, scrcpyWinName } = message;
  let x = 0;
  let y = 0;
  if (task === 'start-scrcpy') {
    let show = false;

    const res = setInterval(() => {
      const getRes = getWindowRect(scrcpyWinName);

      if (getRes) {
        if (!show) {
          show = true;
          parentPort?.postMessage({ type: 'scrcpy-child-win-show' });
        }
        if (x !== getRes.left || y !== getRes.top) {
          parentPort?.postMessage({ type: 'scrcpy-child-win-pos', x: getRes.left, y: getRes.top });
          x = getRes.left;
          y = getRes.top;
        }
      }
      if (!getRes) {
        console.log('getRes1', getRes);
        parentPort?.postMessage(getRes);
        clearInterval(res);
      }
    }, 10);
  }
});
