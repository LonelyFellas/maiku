import { BrowserWindow } from 'electron';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const koffi = require('koffi');

const user32 = koffi.load('user32.dll');
export const BOOL = koffi.alias('BOOL', 'int');

// 定义类型和函数
export const DWORD = koffi.alias('DWORD', 'uint32_t');
export const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
export const HWND = koffi.alias('HWND', 'uint64_t');
export const RECT = koffi.struct('RECT', {
  left: 'long',
  top: 'long',
  right: 'long',
  bottom: 'long',
});

export const FindWindowW = user32.func('HWND __stdcall FindWindowW(const char16_t *lpClassName, const char16_t *lpWindowName)');
export const GetWindowRect = user32.func('BOOL __stdcall GetWindowRect(HWND hWnd, _Out_  RECT *lpRect)');

export const GetWindowLongW = user32.func('uint32_t __stdcall GetWindowLongW(HWND hWnd, int32_t nIndex)');
export const SetWindowLongW = user32.func('uint32_t __stdcall SetWindowLongW(HWND hWnd, int32_t nIndex, uint32_t dwNewLong)');

export const SetParent = user32.func('HWND __stdcall SetParent(HWND hWndChild, HWND hWndNewParent)');
export const SetWindowPos = user32.func('BOOL __stdcall SetWindowPos(HWND hWnd, HWND hWndInsertAfter, int  X, int  Y, int  cx, int  cy, uint32_t uFlags)');

export const GetAncestor = user32.func('HWND  __stdcall GetAncestor(HWND hWnd, uint32_t uFlags)');
export const FindWindowExW = user32.func('HWND __stdcall FindWindowExW(HWND hWndParent, HWND hWndChildAfter, const char16_t * lpszClass, const char16_t * lpszWindow)');

export const SetForegroundWindow = user32.func('BOOL __stdcall SetForegroundWindow(HWND hWnd)');

export const GW_STYLE = {
  WS_CLIPSIBLINGS: 0x004000000,
  WS_CLIPCHILDREN: 0x002000000,
};

export const findWindow = async (title: string) => {
  const hwnd = FindWindowW(null, title);
  if (hwnd) {
    const rect = {};
    if (GetWindowRect(hwnd, rect)) {
      return hwnd;
    } else {
      console.log('GetWindowRect failed');
    }
  } else {
    console.log('FindWindow failed');
  }
  return null;
};

export const getElectronWindow = (id: number) => {
  return FindWindowExW(id, 0, 'Intermediate D3D Window', 0);
};

/**
 * 检查窗口是否存在
 * @param winName string 窗口名字
 * @returns boolean 是否存在
 */
export function checkWindowExists(winName: string) {
  const win = findWindow(winName);
  return win !== null;
}

export function embedWindow({ parentHwnd, nativeHwnd, scrcpyWindow, height, width, direction = 'vertical' }: { parentHwnd: number; nativeHwnd: number; scrcpyWindow: BrowserWindow; height: number; width: number; direction: EleApp.Direction }) {
  scrcpyWindow.on('focus', () => {
    SetForegroundWindow(parentHwnd);
  });
  console.log(`"parentWindow HWND：${parentHwnd}, childWindow HWND：${nativeHwnd}`);
  const winW = GetWindowLongW(parentHwnd, -16);
  if (!(winW & GW_STYLE.WS_CLIPCHILDREN)) {
    SetWindowLongW(parentHwnd, -16, winW ^ GW_STYLE.WS_CLIPCHILDREN ^ GW_STYLE.WS_CLIPSIBLINGS);
  }

  SetWindowLongW(nativeHwnd, -16, 0x50000000);

  SetParent(nativeHwnd, GetAncestor(parentHwnd, 1));
  SetWindowPos(nativeHwnd, 0, 0, direction === 'horizontal' ? 0 : -20, width, height, 0x10);
}
