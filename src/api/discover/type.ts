import { PROXY_TYPE } from '@common';

export interface GetProxyListResult {
  id: number;
  type: keyof typeof PROXY_TYPE;
  address: string;
  port: number;
  username: string;
  password: string;
  detail: string;
  user_id: number;
  running: number;
  pass: number;
  create_at: string;
}

export type PostAddEditProxyParams<IsEdit extends boolean = false> = AddEditType<
  {
    type: string;
    address: string;
    port: number;
    username: string;
    password: string;
    detail: string;
  },
  IsEdit
>;
