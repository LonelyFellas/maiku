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
  }, [message]);

  const handleLanguageChange = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const Component = isMac || isScrcpy ? Fragment : Wrapper;
  return (
    <>
      {window.env.DEV && !isScrcpy && <ReactQueryDevtools initialIsOpen={false} />}
      {window.env.DEV && !isScrcpy && <TanStackRouterDevtools />}
      {window.env.DEV && !isScrcpy && <FloatButton icon={<GlobalIcon />} onClick={handleLanguageChange} style={{ top: 24 }} />}
      <Component>
        {/* 主要是为了去除antd的错误message提示， */}
        <AntdApp>{props.children}</AntdApp>
      </Component>
    </>
  );
};
export default App;
