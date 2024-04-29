import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { I18nConfigContextProvider } from '@common';
import { router } from '@/routes';
import "./index.css"
import {
  RouterProvider,
} from '@tanstack/react-router';



window.env = import.meta.env;
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <I18nConfigContextProvider>
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
    </I18nConfigContextProvider>,
  );
}
// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
