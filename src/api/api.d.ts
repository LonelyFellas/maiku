declare namespace Api {
  type Url = string | URL | Request;

  interface Init<TParam> extends RequestInit {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    data?: TParam;
    body?: string;
  }

  type IFetch<TData, TParams> = (data: TParams) => Promise<TData>;
}
