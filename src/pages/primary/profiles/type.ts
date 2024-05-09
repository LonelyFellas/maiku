import type React from 'react';

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
  operation: string;
}
