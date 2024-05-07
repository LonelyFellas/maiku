import ReactDOM from 'react-dom/client';
import { ConfigProvider, message } from 'antd';
import { I18nConfigContextProvider, isMacFunc } from '@common';
import { queryClient, router } from '@/routes';
import './index.css';
import { RouterProvider } from '@tanstack/react-router';
import { GlobalScrollbarProvider } from '@darwish/scrollbar-react';
import '@darwish/scrollbar-react/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';

const isMac = isMacFunc();
window.env = import.meta.env;
/** windows因为是自定义的头部所以要适配 */
message.config({
  top: !isMac ? 28 : 8,
});

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <I18nConfigContextProvider>
        <GlobalScrollbarProvider
          config={{
            thumbColor: 'rgba(0,0,0,0.5)',
            trackColor: 'transparent',
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
            <RouterProvider router={router} />
          </ConfigProvider>
        </GlobalScrollbarProvider>
      </I18nConfigContextProvider>
    </QueryClientProvider>,
  );
}
