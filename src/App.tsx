import { useEffect, type PropsWithChildren } from 'react';
import { FloatButton, message } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useI18nConfig, Wrapper, useUpdate, isScrcpyWindow, getParamsUrl } from '@common';
import ScrcpyHeader from '@common/components/wrapper/scrcpy-header.tsx';

const App = (props: PropsWithChildren<object>) => {
  const navagate = useNavigate();
  const { setIsUpdate } = useUpdate();
  const [, setLang] = useI18nConfig();

  useEffect(() => {
    if (isScrcpyWindow) {
      const [title, deviceAddr] = getParamsUrl(['title', 'deviceAddr']);
      navagate({ to: `/scrcpy?title=${title}&deviceAddr=${deviceAddr}` });
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
  }, [message]);

  const handleLanguageChange = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const Component = isScrcpyWindow ? ScrcpyHeader : Wrapper;
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
