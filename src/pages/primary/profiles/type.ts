import type React from 'react';

export interface States {
  loading: boolean;
  running: 'running' | 'waiting' | 'stop';
  containerName: string;
}

export interface DataType {
  num: React.Key;
  Names: string;
  State: string;
  index?: number;
  // category: string;
  // index: number;
  // name: string;
  // deviceInfo: string;
  // remark: string;
  // tags: string;
  // lastOpenTime: string;
  // createTime: string;
  isVisible?: boolean;
  deviceId: string;
  envId?: string;
  running: States['running'];
}

export interface StartScrcpyParams {
  deviceId: string;
  envId: string;
  name: string;
  states: string;
}
