import { PROXY_TYPE } from '/src/common';

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
  screenShot: string;
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

export interface GetBackupListByIdParams {
  envId: number;
}

export interface GetBackupListByIdResult {
  Names: string;
  State: string;
  index: number;
}

export interface GetBackupParams {
  envId: number;
  containerName: string;
}

export interface PostSetBackupProxyParams {
  envId: number;
  vpcId: number;
}

export interface PostBackupProxyResult {
  addr: string;
  status: number;
  statusText: string;
  type?: keyof typeof PROXY_TYPE;
}

export interface GetBackupToBackupParams extends GetBackupParams {
  newName: string;
}

export interface PostPushFileService {
  envId: number;
  fileId: number;
}

export interface GetListDeviceResult {
  bak_number: number;
  device_name: string;
  expTime: number;
  expiration: number;
  ext_name: string;
  group_id: number | null;
  id: number;
  imageName: string;
  name: string;
  number: number;
  p1: number;
  p2: number;
  pid: number;
  pname: string;
  screenshot: string;
  screenshot2: string;
  status: number;
  time_length: number;
}
