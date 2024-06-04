import { QueryClient } from '@tanstack/react-query';
import { createHashHistory, createRootRouteWithContext, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { ErrorComponent } from '@common';
import App from '@/App.tsx';
import FileTransferStation from '@/pages/discover/file-transfer';
import Proxy from '@/pages/discover/proxy';
import AddBatches from '@/pages/discover/proxy/add-batches.tsx';
import { IndexPage } from '@/pages/index-page.tsx';
import Layout from '@/pages/layout';
import NewProfiles from '@/pages/layout/new-profiles.tsx';
import UpgradePkg from '@/pages/layout/upgrade-pkg.tsx';
import Login from '@/pages/login';
import Profiles from '@/pages/primary/profiles';
import { postsEnvQueryOptions, postsFileQueryOptions, postsProxyQueryOptions } from './data.ts';

const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <App>
      <div className="h-full">
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
  component: IndexPage,
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
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(postsEnvQueryOptions),
  meta: () => [{ title: '环境管理' }],
});
/** 代理管理 */
const proxy = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/proxy',
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(postsProxyQueryOptions),
  component: Proxy,
  meta: () => [{ title: '代理管理' }],
});
/** 文件中转站 */
const fileTransfer = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/file_transfer',
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(postsFileQueryOptions),
  component: FileTransferStation,
  meta: () => [{ title: '文件中转站' }],
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

/** 新建环境或者编辑环境 */
const newProfiles = createRoute({
  getParentRoute: () => layoutRoute,
  // id为-1时为新建环境，否则为编辑环境
  path: `/new_profiles/$id`,
  component: NewProfiles,
  meta: (context) => [
    {
      title: context.params.id === '-1' ? '新建环境' : '编辑环境',
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

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, layoutRoute.addChildren([profiles, newProfiles, proxy, upgradePkg, addBatchesProxy, fileTransfer])]);

export const queryClient = new QueryClient();
export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPreload: 'intent',
  defaultStaleTime: 0,
  context: {
    queryClient,
  },
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
