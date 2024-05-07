import { queryOptions } from '@tanstack/react-query';

async function fetchProxyData(): Promise<Darwish.AnyObj[]> {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return new Promise((resolve) => {
    import('./fake.json').then((res) => resolve(res.default));
  });
}

export const postsProxyQueryOptions = queryOptions({
  queryKey: ['posts-proxy-list'],
  queryFn: () => fetchProxyData(),
});
