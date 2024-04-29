import ReactDOM from 'react-dom/client'
import { I18nConfigContextProvider } from "@common"
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nConfigContextProvider>
    <App />
  </I18nConfigContextProvider>
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
