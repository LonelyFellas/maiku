export interface GetAllEnvListResult {
  id: number;
  name: string;
  adbPort: number;
  user_id: number;
  create_at: string;
  vpc_id: number;
  adbAddr: string;
}

export interface PostAddEnvParams {
  name?: string;
  width?: number;
  height?: number;
  dpi?: number;
  disk?: number;
  memory?: number;
  type: string;
  address: string;
  port: number;
  username?: string;
  password?: string;
  detail?: string;
}
