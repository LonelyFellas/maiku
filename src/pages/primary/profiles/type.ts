import type React from 'react';

export interface States {
  loading: boolean;
  running: 'running' | 'waiting' | 'stop';
  containerName: string;
  type?: 'start' | 'restart' | 'switch';
}

export interface DataType {
  num: React.Key;
  Names: string;
  State: string;
  index?: number;
  isVisible?: boolean;
  adbAddr: string;
  envId: number;
  running: States['running'];
  containerName: States['containerName'];
  envName: string;
  windowsSize: WindowsSize;
}

export interface StartScrcpyParams {
  adbAddr: string;
  envId: number;
  name: string;
  states: string;
  containerName: string;
  envName: string;
}

export type WindowsSize = Record<string, 'small' | 'default' | 'large'>;
