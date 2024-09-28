import { contextBridge, ipcRenderer } from 'electron';
import exposes from './exposes/index.ts';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    // 设置白名单，限制可以访问的channel
    const whitelist: (keyof OnChannelMap)[] = ['error', 'update-available', 'update-progress', 'update-downloaded', 'close-device-envId', 'scrcpy:env-win-exist', 'scrcpy:show-screen-shot-window', 'scrcpy:start-window-open', 'open-scrcpy-window'];
    if (whitelist.includes(channel as any)) {
      return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    // 同上
    const whitelist = [] as string[];
    if (whitelist.includes(channel)) {
      return ipcRenderer.off(channel, ...omit);
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    // 同上
    const whitelist = [
      'scrcpy:window-state',
      'scrcpy:reembed-window',
      'scrcpy:rotate-screen',
      'scrcpy:init-size-window',
      'scrcpy:screen-shot',
      'scrcpy:start',
      'scrcpy:stop',
      'app:operate',
      'loading:done',
      'download-update',
      'updated-restart',
      'download-file',
      'scrcpy:show-toast',
      'show-scrcpy-window',
      'set-resizebale-true-scrcpy-window',
    ] as unknown[] as UnionToTuple<keyof SendChannelMap>;
    if (whitelist.includes(channel as any)) {
      return ipcRenderer.send(channel, ...omit);
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    // 同上
    const whitelist: (keyof InvokeChannelMap)[] = ['window:state', 'dialog:open', 'scrcpy:adb-keyboard', 'get-static-path'];
    if (whitelist.includes(channel as any)) {
      return ipcRenderer.invoke(channel, ...omit);
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld('adbApi', exposes.init());
window.dispatchEvent(new Event('preload-ready'));
