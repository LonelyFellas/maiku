export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

export interface RegisterParams {
  mobile: string;
  password: string;
  password2: string;
}
