// main.js (主进程)
import { Worker } from 'node:worker_threads';
import { __dirname, createBrowserWindow } from '../utils';
import path from 'node:path';

// 创建一个函数来发送计时任务到 Worker 线程
export function runScrcpyTimerTask(scrcpyWinName: string) {
  // 创建 Worker 线程
  const childWin = createBrowserWindow({
    width: 80,
    height: 400,
    x: 0,
    y: 0,
    show: false,
  });
  console.log(path.resolve(__dirname, 'worker.js'));
  const worker = new Worker(path.resolve(__dirname, 'worker.js'));

  // 监听 Worker 的消息
  worker.on('message', (message: { type: string; x?: number; y?: number }) => {
    if (message.type === 'scrcpy-child-win-show') {
      childWin.show();
    }
    if (message.type === 'scrcpy-child-win-pos') {
      console.log(message.x, message.y);
      childWin.setBounds({
        width: 80,
        height: 400,
        x: message.x ?? 0,
        y: message.y ?? 0,
      });
    }
  });

  // 监听 Worker 的错误
  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  // 监听 Worker 退出
  worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
  });

  worker.postMessage({ task: 'start-scrcpy', scrcpyWinName }); // 向 Worker 线程发送任务
}
