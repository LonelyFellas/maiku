import type React from 'react';
import type { MessageBoxReturnValue, OpenDialogOptions } from 'electron';
import type { Client } from '@devicefarmer/adbkit';
import type { ColumnsType } from 'antd/es/table';
import type { ModalProps } from 'antd';

declare global {
  type AnyObj = Darwish.AnyObj;
  type EmptyObj = Darwish.EmptyObj;
  type GenericsFn<P = null, R = null> = Darwish.GenericsFn<P, R>;
  type WindowState = 'close' | 'minimize' | 'maximize';
  type RememberState = '' | 'close' | 'minimizeToTray';
  type InvokeChannelMap = {
    'window:state': [[WindowState, RememberState] | [WindowState], boolean | MessageBoxReturnValue | undefined];
    'dialog:open': [OpenDialogOptions, string[] | { url: string; name: string; size: number }[]];
    'scrcpy:adb-keyboard': [[string], boolean];
    'get-static-path': [[string], string];
  };
  type SendChannelMap = {
    'scrcpy:window-state': [WindowState, string];
    'scrcpy:reembed-window': [string];
    'scrcpy:screen-shot': [{ type: 'close' | 'open'; winName: string }];
    'scrcpy:init-size-window': [{ winName: string; direction: 'vertical' | 'horizontal' }];
    'scrcpy:start': [
      {
        adbAddr: string;
        id: number;
        type: 'start' | 'restart' | 'switch';
        name: string;
        token: string;
        imgHostName: string;
        imgPort: string | null;
      },
    ];
    'scrcpy:rotate-screen': [{ winName: string; direction: 'vertical' | 'horizontal' }];
    'scrcpy:stop': [{ adbAddr: string }];
    'app:operate': ['close' | 'restart'];
    'loading:done': ['main' | 'loading'];
    'download-update': [];
    'updated-restart': [];
    'download-file': [
      string,
      {
        /** 是否打开文件弹出框 */
        isDialog?: boolean;
      } & Electron.SaveDialogOptions,
    ];
    'scrcpy:show-toast': [
      'transparent' | 'fileUpload',
      {
        deviceAddr: string;
        isExpended: boolean;
      },
    ];
    'set-adb-keyboard': [[string, 'start' | 'close'], boolean];
  };
  type OnChannelMap = {
    error: Darwish.AnyFunc;
    'update-available': GenericsFn<[unknown, { isUpdate: boolean }], void>;
    'update-progress': GenericsFn<[unknown, { progress: number }], void>;
    'update-downloaded': GenericsFn<[unknown], void>;
    'close-device-envId': GenericsFn<[unknown, number], any>;
    'scrcpy:env-win-exist': GenericsFn<[unknown, string], void>;
    'scrcpy:show-screen-shot-window': GenericsFn<[unknown, { port: string; winName: string }], void>;
    'scrcpy:start-window-open': GenericsFn<[unknown, { envId: number; backupName: string; isSuccess?: boolean }]>;
    'open-scrcpy-window': Darwish.AnyFunc;
    'show-scrcpy-window': GenericsFn<[unknown, string]>;
    // prettier-ignore
  };

  interface IpcRenderer extends Omit<IpcRenderer, 'invoke' | 'send'> {
    invoke: <T extends keyof InvokeChannelMapChannelMap>(channel: T, ...args: InvokeChannelMap[T][0]) => Promise<InvokeChannelMap[T][1]>;
    send: <T extends keyof SendChannelMap>(channel: T, ...args: SendChannelMap[T]) => Promise<any>;
    on: <T extends keyof OnChannelMap>(channel: T, listener: OnChannelMap[T]) => void;
  }

  type I18nConfig = {
    lang: '简体中文' | 'English';
    config: typeof import('@/assets/messages/en.json');
  };

  /**
   *  获取对象属性值类型
   *  @example
   *  type A = { a: { b: string } };
   *  type B = PathValue<A, 'a'>; // { b: string }
   *  type B = PathValue<A, 'a.b'>; // string
   *  type C = PathValue<A, 'a.c'>; // never
   */
  type PathValue<T, P extends string | null = null> = P extends null ? T : P extends `${infer K}.${infer Rest}` ? (K extends keyof T ? PathValue<T[K], Rest> : never) : P extends keyof T ? T[P] : never;
  type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;
  type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
  type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

  type Push<T extends any[], V> = [...T, V];

  // Used in Renderer process, expose in `preload.ts`
  interface Window {
    env: ImportMeta['env'];
    ipcRenderer: IpcRenderer;
    adbApi: {
      connect: Client['connect'];
      disconnect: Client['disconnect'];
      reconnect: Client['connect'];
      reboot: Client['reboot'];
      getDevice: Client['getDevice'];
      listDevices: () => Promise<{ type: 'device' | 'offline'; id: string }[]>;
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

  // interface SelectedFiles {
  //   url: string;
  //   name: string;
  //   size: number;
  //   status?: number;
  // }
  //
  // interface GetAdbFile {
  //   name: string;
  //   size: number;
  // }

  type ReactAction<T> = React.Dispatch<React.SetStateAction<T>>;
  type ReactFCWithChildren<T> = React.FC<React.PropsWithChildren<T>>;

  interface UserInfo {
    id?: number;
    role?: number;
    username?: string;
  }

  /**
   * Antd Table Column 的类型定义
   */
  type AntdColumns<RecordType = Darwish.AnyObj> = ColumnsType<RecordType>;
  /**
   * React.MouseEvent 的类型定义
   */
  type ReactMouseEvent<T extends Element, E = React.MouseEvent<T, MouseEvent>> = E;

  /**
   * Antd Modal 的类型定义
   * 重写了onOk的类型定义，把event参数改为可选参数
   */
  interface AntdModalProps<T extends Element = HTMLButtonElement> extends Omit<ModalProps, 'onOk' | 'onCancel'> {
    onOk: (e?: ReactMouseEvent<T>) => void;
    onCancel: (e?: ReactMouseEvent<T>) => void;
  }

  /**
   * 新增编辑统一的接口定义
   */
  type MergeObj<T extends AnyObj, U extends AnyObj, Merge extends AnyObj = U extends EmptyObj ? T : T extends EmptyObj ? U : T & U> = {
    [K in keyof Merge]: Merge[K];
  };
  type AddEditType<
    Obj extends AnyObj,
    IsEdit extends boolean = false,
    ExcludeParams extends AnyObj = {
      id: number;
    },
  > = MergeObj<Obj, IsEdit extends true ? ExcludeParams : {}>;
}

export {};
