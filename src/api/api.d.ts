declare namespace Api {
  type Url = string | URL | Request;

  interface Init<TParam> extends RequestInit {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    data?: TParam;
    body?: string | FormData;
    formData?: boolean;
    contentType?: keyof ContentType;
    headers?: { 'Content-Type': any; 'X-token': string } | Record<string, string>;
  }

  type IFetch<TData, TParams = null> = TParams extends null ? () => Promise<TData> : (data: TParams) => Promise<TData>;

  type ContentType = {
    json: 'application/json';
    'app-form': 'application/x-www-form-urlencoded';
    'mul-form': 'multipart/form-data';
  };
}
