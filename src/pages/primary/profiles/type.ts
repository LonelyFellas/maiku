import type React from 'react';

export interface States {
  loading: boolean;
  running: 'running' | 'waiting' | 'stop';
  containerName: string;
  type?: 'run';
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
  envId?: number;
  running: States['running'];
  containerName: States['containerName'];
  envName: string;
}

export interface StartScrcpyParams {
  deviceId: string;
  envId: number;
  name: string;
  states: string;
  containerName: string;
  envName: string;
}
