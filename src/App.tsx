import { useEffect, Fragment, type PropsWithChildren } from 'react';
import { FloatButton, message } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { isMacFunc, useI18nConfig, Wrapper, useUpdate, useScrcpyRecord, useLoadingDone, isScrcpyWindow } from '@common';

const App = (props: PropsWithChildren<object>) => {
  useLoadingDone();
  const navagate = useNavigate();
  const { setIsUpdate } = useUpdate();
  const { setData, data } = useScrcpyRecord(); // const { message } = AntdApp.useApp();
  const [, setLang] = useI18nConfig();
  const isMac = isMacFunc();

  useEffect(() => {
    if (isScrcpyWindow) {
      console.log('href', window.location.href);
      const urlObj = new URL(window.location.href);
      const params = new URLSearchParams(urlObj.search);
      const title = params.get('title');
      const envId = params.get('envId');
      navagate({ to: `/scrcpy?title=${title}&envId=${envId}` });
    }
  }, []);

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

  const Component = isMac ? Fragment : Wrapper;
  const isPurePages = window.env.DEV && !isScrcpyWindow;
  return (
    <>
      {isPurePages && <ReactQueryDevtools initialIsOpen={false} />}
      {isPurePages && <TanStackRouterDevtools />}
      {isPurePages && <FloatButton icon={<GlobalIcon />} onClick={handleLanguageChange} style={{ top: 24 }} />}
      <Component>{props.children}</Component>
    </>
  );
};
export default App;
