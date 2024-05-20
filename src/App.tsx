import { useEffect, Fragment, type PropsWithChildren } from 'react';
import { FloatButton, App as AntdApp, message } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { isMacFunc, useI18nConfig, Wrapper, useUpdate, useScrcpyRecord } from '@common';

const App = (props: PropsWithChildren<object>) => {
  const { href } = window.location;
  const isScrcpy = href.includes('scrcpy');
  const { setIsUpdate } = useUpdate();
  const { setData, data } = useScrcpyRecord(); // const { message } = AntdApp.useApp();
  const [, setLang] = useI18nConfig();
  const isMac = isMacFunc();

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

    // 监听scrcpy窗口是否存在
    window.ipcRenderer.on('scrcpy:env-win-exist', (_, envId) => {
      const newMap = structuredClone(data);
      newMap.set(envId, new Date().getTime()), setData(newMap);
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
