import { useEffect, type PropsWithChildren } from 'react';
import { FloatButton, message, App as AntdApp } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useI18nConfig, Wrapper, useUpdate } from '@common';

const App = (props: PropsWithChildren<object>) => {
  const { setIsUpdate } = useUpdate();
  const [, setLang] = useI18nConfig();

  useEffect(() => {
    window.ipcRenderer.on('error', (_, error) => {
      console.error(error);
      message.error(error);
    });
    window.ipcRenderer.on('update-available', (_, msg) => {
      setIsUpdate(msg.isUpdate);
    });

    // scrcpy窗口打开成功
    window.ipcRenderer.on('open-scrcpy-window', (args: any) => {
      console.info('open-scrcpy-window: ', args);
    });
  }, [message]);

  const handleLanguageChange = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  return (
    <>
      {window.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      {window.env.DEV && <TanStackRouterDevtools />}
      {window.env.DEV && <FloatButton icon={<GlobalIcon />} onClick={handleLanguageChange} style={{ top: 24 }} />}
      <Wrapper>
        <AntdApp>{props.children}</AntdApp>
      </Wrapper>
    </>
  );
};
export default App;
