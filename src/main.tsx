import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { GlobalScrollbarProvider } from '@darwish/scrollbar-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { I18nConfigContextProvider } from '@common';
import { queryClient, router } from '@/routes';
import './index.css';
import '@darwish/scrollbar-react/dist/style.css';
import ScrcpyPage from './pages/child-windows/scrcpy';
import ScreenShotPage from './pages/child-windows/screen-shot';

window.env = import.meta.env;
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  const WindowView = (props: React.PropsWithChildren<object>) => {
    const routeUrl = new URL(window.location.href);
    const paramsGetRes = routeUrl.searchParams.get('window_name');

    const MainView = () => {
      switch (paramsGetRes) {
        case 'scrcpy_window':
          return <ScrcpyPage />;
        case 'scrcpy_screen_shot_window':
          return <ScreenShotPage />;
        default:
          return props.children;
      }
    };
    return <MainView />;
  };
  root.render(
    <QueryClientProvider client={queryClient}>
      <I18nConfigContextProvider>
        <GlobalScrollbarProvider
          config={{
            thumbColor: 'rgba(0,0,0,0.5)',
            trackColor: 'transparent',
            scrollbarWidth: 6,
          }}
        >
          <ConfigProvider
            theme={{
              token: {
                // Seed Token，影响范围大
                colorPrimary: '#5b7cfd',
                borderRadius: 4,
              },
            }}
          >
            <WindowView>
              <RouterProvider router={router} />
            </WindowView>
          </ConfigProvider>
        </GlobalScrollbarProvider>
      </I18nConfigContextProvider>
    </QueryClientProvider>,
  );
}
