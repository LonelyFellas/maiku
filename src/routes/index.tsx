import { createHashHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import App from '@/App.tsx';
import { ErrorComponent } from '@common';
import Login from '@/pages/login';
import Layout from '@/pages/layout';
import Profiles from '@/pages/primary/profiles';
import NewProfiles from '@/pages/primary/profiles/new-profiles.tsx';
import Proxy from '@/pages/discover/proxy';

const rootRoute = createRootRoute({
  component: () => (
    <App>
      <div className="h-full bg-gray-100">
        <Outlet />
      </div>
    </App>
  ),
  errorComponent: ErrorComponent,
});
/** 主页 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});

/** 登录页面 */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

/** home */
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/layout',
  component: Layout,
});

/** 环境管理 */
const profiles = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profiles',
  component: Profiles,
  meta: () => [{ title: '环境管理' }],
});
/** 代理管理 */
const proxy = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/proxy',
  component: Proxy,
  meta: () => [{ title: '代理管理' }],
});

/** 新建环境 */
const newProfiles = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/new_profiles',
  component: NewProfiles,
  meta: () => [{
    title: '新建环境',
    isBack: true,
  }],
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  layoutRoute.addChildren([profiles, newProfiles, proxy]),
]);

export const router = createRouter({ routeTree, history: createHashHistory() });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
