import { createRootRoute, Outlet } from '@tanstack/react-router';
import App from '../App';
import { Wrapper } from '../common/components';

export const Route = createRootRoute({
  component: () => (
    <App>
      <div className="h-full bg-gray-100">
        <Outlet />
      </div>
    </App>
  ),
  errorComponent: () => (
    <Wrapper>
      <div>数据发生了错误，请稍后再试或重启应用！</div>
    </Wrapper>
  ),
});
