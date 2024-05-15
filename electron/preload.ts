import { ipcRenderer, contextBridge } from 'electron';
import exposes from './exposes/index.ts';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    // 设置白名单，限制可以访问的channel
    const whitelist: UnionToTuple<keyof OnChannelMap> = ['error'];
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
    const whitelist = ['scrcpy:start', 'app:operate', 'loading:done'] as unknown as UnionToTuple<keyof SendChannelMap>;
    if (whitelist.includes(channel as any)) {
      return ipcRenderer.send(channel, ...omit);
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    // 同上
    const whitelist: UnionToTuple<keyof InvokeChannelMap> = ['window:state', 'dialog:open'];
    if (whitelist.includes(channel as any)) {
      return ipcRenderer.invoke(channel, ...omit);
    }
    return Promise.reject(new Error(`Channel ${channel} is not allowed`));
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld('adbApi', exposes.init());
