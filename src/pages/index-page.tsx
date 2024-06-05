import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { hasToken } from '@common';

export function IndexPage() {
  const navigate = useNavigate({ from: '/' });
  useEffect(() => {
    if (hasToken) {
      navigate({ to: '/layout/profiles' });
    } else {
      navigate({ to: '/login' });
    }

    setTimeout(() => {
      console.log(22);
      window.ipcRenderer.send('loading:done', 'main');
    }, 1500);
  }, []);
  return <></>;
}
