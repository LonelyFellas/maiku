import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { I18nConfigContextProvider } from '@common';
import "./index.css"
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from '@tanstack/react-router';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });


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
