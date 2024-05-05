import { useEffectOnce } from '@darwish/hooks-core';

/**
 * 检查是否完成加载
 * 如果完成，则通知客户端加载完成显示登录模块
 */
export default function useLoadingDone() {
  useEffectOnce(() => {
    window.ipcRenderer.send('loading:done', 'main');
  });
}
