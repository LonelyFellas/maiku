import Login from '@/pages/login';
import ScrcpyWindow from '@/pages/scrcpy';

export function IndexPage() {
  const { href } = window.location;
  return href.includes('scrcpy') ? <ScrcpyWindow /> : <Login />;
}
