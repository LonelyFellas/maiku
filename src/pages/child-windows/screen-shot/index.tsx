import { useEffect, useState } from 'react';

export default function ScreenShotPage() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const winName = params.get('win_name') ?? '闪电云手机';
  const adbAddr = params.get('adbAddr') ?? '1234567890';
  const port = params.get('port') ?? '12345';
  const [states, setStates] = useState({
    winName,
    t: new Date().getTime(),
  });

  useEffect(() => {
    window.adbApi.shell(adbAddr, `screencap -p f"/sdcard/Pictures/${port}-${states.t}.png"`);
    setTimeout(() => {
      window.ipcRenderer.send('scrcpy:screen-shot', { type: 'close', winName });
    }, 3000);
  }, [states.t]);

  useEffect(() => {
    window.ipcRenderer.on('scrcpy:show-screen-shot-window', (_, { port: pPort, winName: pWinName }) => {
      if (port == pPort && states.winName === pWinName) {
        setStates({ t: new Date().getTime(), winName: pWinName });
      }
    });
  }, []);

  return (
    <div className="h-screen w-screen p-[10px]">
      <img className="size-full" src={`http://p297.npaas.cn/proxy-api/task=snap&level=1?port=${port}&t=${states.t}`}></img>
    </div>
  );
}
