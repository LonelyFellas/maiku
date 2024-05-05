import type React from 'react';

export interface DataType {
  key: number;
  num: React.Key;
  category: string;
  index: number;
  name: string;
  deviceInfo: string;
  remark: string;
  tags: string;
  lastOpenTime: string;
  createTime: string;
  isVisible?: boolean;
  operation: string;
}
