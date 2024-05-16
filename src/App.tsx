import { useEffect, Fragment, type PropsWithChildren } from 'react';
import { FloatButton, App as AntdApp, message } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isMacFunc, useI18nConfig, Wrapper } from '@common';

const App = (props: PropsWithChildren<object>) => {
  const { href } = window.location;
  const isScrcpy = href.includes('scrcpy');
  // const { message } = AntdApp.useApp();
  const [, setLang] = useI18nConfig();
  const isMac = isMacFunc();

  useEffect(() => {
    window.ipcRenderer.on('error', (_, error) => {
      console.error(error);
      message.error(error);
    });
    window.ipcRenderer.on('update-available', (args: any) => {
      console.info('args: ', args);
    });
    // scrcpy窗口打开成功
    window.ipcRenderer.on('open-scrcpy-window', (args: any) => {
      console.info('open-scrcpy-window: ', args);
    });
  }, [message]);

  const handleLanguageChange = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const Component = isMac || isScrcpy ? Fragment : Wrapper;
  const isPurePages = window.env.DEV && !isScrcpy;
  return (
    <>
      {isPurePages && <ReactQueryDevtools initialIsOpen={false} />}
      {isPurePages && <TanStackRouterDevtools />}
      {isPurePages && <FloatButton icon={<GlobalIcon />} onClick={handleLanguageChange} style={{ top: 24 }} />}
      <Component>
        {/* 主要是为了去除antd的错误message提示， */}
        <AntdApp>{props.children}</AntdApp>
      </Component>
    </>
  );
};
export default App;
