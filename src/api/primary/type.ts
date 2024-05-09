export interface GetAllEnvListResult {
  id: number;
  name: string;
  adbPort: number;
  user_id: number;
  create_at: string;
  vpc_id: number;
  adbAddr: string;
  px_type: PostAddEnvParams['px_type'];
  address: string;
  port: number;
  username: string;
  password: string;
}

export type PostAddEnvParams<IsEdit extends boolean = false> = AddEditType<
  {
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

    /**
     * * 1: auto-720
     * * 2: auto-1080
     * * 100: custom 自定义分辨率
     */
    px_type: '1' | '2' | '100';
  },
  IsEdit
>;

export type GetBackupListByIdParams = {
  envId: string;
};
export type GetBackupListByIdResult = {
  Names: string;
  state: string;
  index: number;
};
