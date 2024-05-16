export enum Constants {
  LOCAL_LOGIN_INFO = 'login-info', // 用户信息
  LOCAL_TOKEN = 'login-token', // token
  LOCAL_WINDOW_CLOSE = 'window-close', // 窗口关闭的几种逻辑的记忆
  LOCAL_CURRENT_VERSION = 'current-version', // 当前版本
  SESSION_SKIP_VERSION = 'skip-version', // 跳过此次版本
}

export const PROXY_TYPE = {
  '1': 'socks5',
  '2': 'http',
  '3': 'https',
};
