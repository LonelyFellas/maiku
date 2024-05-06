import React, { useEffect, Fragment, type PropsWithChildren } from 'react';
import { isMacFunc, useI18nConfig, Wrapper } from '@common';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { FloatButton, message, App as AntdApp } from 'antd';
import { GlobalOutlined as GlobalIcon } from '@ant-design/icons/lib/icons';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const queryClient = new QueryClient();
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

const App = (props: PropsWithChildren<object>) => {
  const [showDevtools, setShowDevtools] = React.useState(false);
  // const
  const [, setLang] = useI18nConfig();
  const isMac = isMacFunc();

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old);
    window.ipcRenderer.on('error', (_, error) => {
      message.error(error).then(() => {
        console.error(error);
      });
    });
  }, []);

  const handleLanguageChange = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const Component = isMac ? Fragment : Wrapper;
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      {window.env.DEV && <TanStackRouterDevtools />}
      {window.env.DEV && (
        <FloatButton
          icon={<GlobalIcon />}
          onClick={handleLanguageChange}
          style={{ top: 24 }}
        />
      )}
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}

      <Component>
        {/* 主要是为了去除antd的错误message提示， */}
        <AntdApp>{props.children}</AntdApp>
      </Component>
    </QueryClientProvider>
  );
};
export default App;
