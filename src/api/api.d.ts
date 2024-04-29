declare namespace Api {
  type Url = string | URL | Request;

  interface Init<TParam> extends RequestInit {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    data?: T;
    body?: string;
  }

  type IFetch<TData, TParams> = (data: TParams) => Promise<TData>;
}
