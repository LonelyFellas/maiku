/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
    DIST: string;
  }

  // 增加electron全局变量的参数
  interface EventEmitter {
    isQuitting: boolean;
  }
}

// // Used in Renderer process, expose in `preload.ts`
// interface Window {
//   ipcRenderer: import('electron').IpcRenderer
// }
declare namespace ElectronClient {
  interface FileOperationOptions {
    type: 'save' | 'remove';
    data?: string | NodeJS.ArrayBufferView;
    outputPath: string;
  }
}

declare namespace Electron {
  interface IM extends Electron.IpcMain {
    handle: <T extends keyof InvokeChannelMap>(channel: T, listener: (event: Electron.IpcMainEvent, ...args: InvokeChannelMap[T][0]) => Promise<InvokeChannelMap[T][1]>) => Promise<any>;
    on: <T extends keyof SendChannelMap>(channel: T, listener: (event: Electron.IpcMainEvent, ...args: SendChannelMap[T]) => void) => Promise<void>;
  }
}
