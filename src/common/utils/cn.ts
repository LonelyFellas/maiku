import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * 合并tailwind类名
 * @param inputs 类名列表
 */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
