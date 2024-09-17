import { useEffect, useState } from 'react';

export default function ScreenShotPage() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const winName = params.get('win_name') ?? '闪电云手机';
  const port = params.get('port') ?? '12345';

  const [states, setStates] = useState({
    port,
    t: new Date().getTime(),
    winName,
  });

  useEffect(() => {
    setTimeout(() => {
      window.ipcRenderer.send('scrcpy:screen-shot', { type: 'close', winName });
    }, 3000);
  }, [states.t, states.port, states.winName]);

  useEffect(() => {
    window.ipcRenderer.on('scrcpy:show-screen-shot-window', (_, { port }) => {
      setStates({ port, t: new Date().getTime(), winName });
    });
  }, []);

  return (
    <div className="h-screen w-screen p-[10px]">
      <img className="size-full" src={`http://p297.npaas.cn/proxy-api/task=snap&level=1?port=${port}&t=${new Date().getTime()}`}></img>
    </div>
  );
}
