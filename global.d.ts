import type React from 'react';
import type { Client } from '@devicefarmer/adbkit';
import type { ColumnsType } from 'antd/es/table';

declare global {
  interface I18nConfig {
    lang: '简体中文' | 'English';
    config: {
      metadata: {
        basic: {
          title: string;
          description: string;
        };
      };
    };
  }

  // Used in Renderer process, expose in `preload.ts`
  interface Window {
    env: ImportMeta['env'];
    ipcRenderer: import('electron').IpcRenderer;
    adbApi: {
      connect: Client['connect'];
      disconnect: Client['disconnect'];
      getDevice: Client['getDevice'];
      getPackages: (serial: string) => Promise<any>;
      kill: Client['kill'];
      shell: (id: string, command: string) => Promise<any>;
      push: (
        id: string,
        filePath: string,
        option?: {
          progress?: (status) => void;
          savePath?: string;
        },
      ) => Promise<any>;
      readdir: (id: string, filePath: string) => Promise<any>;
      shellResult: (id: string, command: string) => Promise<string>;
    };
    userInfo: Store.UserInfo;
    toggleDevtools: () => void;
  }

  interface SelectedFiles {
    url: string;
    name: string;
    size: number;
    status?: number;
  }

  interface GetAdbFile {
    name: string;
    size: number;
  }

  type ReactAction<T> = React.Dispatch<React.SetStateAction<T>>;
  type ReactFCWithChildren<T> = React.FC<React.PropsWithChildren<T>>;

  interface UserInfo {
    id: number;
    role: number;
    username: string;
  }

  type AntdColumns<RecordType = Darwish.AnyObj> = ColumnsType<RecordType>;
}
export {};
