declare namespace Api {
  type Url = string | URL | Request;

  interface Init<TParam> extends RequestInit {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    data?: TParam;
    body?: string;
    formData?: boolean;
  }

  type IFetch<TData, TParams = null> = TParams extends null ? () => Promise<TData> : (data: TParams) => Promise<TData>;
}
