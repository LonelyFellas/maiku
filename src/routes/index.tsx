import {
  createHashHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import App from '@/App.tsx';
import { ErrorComponent } from '@common';
import Login from '@/pages/login';
import Layout from '@/pages/layout';
import Profiles from '@/pages/primary/profiles';
import NewProfiles from '@/pages/layout/new-profiles.tsx';
import Proxy from '@/pages/discover/proxy';
import AddBatches from '@/pages/discover/proxy/add-batches.tsx';
import UpgradePkg from '@/pages/layout/upgrade-pkg.tsx';
import { postsProxyQueryOptions } from './data.ts';

const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
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
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsProxyQueryOptions),
  component: Proxy,
  meta: () => [{ title: '代理管理' }],
});
/** 批量添加代理 */
const addBatchesProxy = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/add_batches_proxy',
  component: AddBatches,
  meta: () => [
    {
      title: '批量添加',
      isBack: true,
    },
  ],
});

/** 新建环境 */
const newProfiles = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/new_profiles',
  component: NewProfiles,
  meta: () => [
    {
      title: '新建环境',
      isBack: true,
    },
  ],
});
/** 升级套餐 */
const upgradePkg = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/upgrade_pkg',
  component: UpgradePkg,
  meta: () => [
    {
      title: '升级套餐',
      isBack: true,
    },
  ],
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  layoutRoute.addChildren([
    profiles,
    newProfiles,
    proxy,
    upgradePkg,
    addBatchesProxy,
  ]),
]);

const queryClient = new QueryClient();
export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: {
    queryClient,
  },
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
