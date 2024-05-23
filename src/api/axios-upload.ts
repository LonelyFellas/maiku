import axios from 'axios';
import { getToken } from '@common';

interface AxiosUpload {
  onSuccess?: (res: any) => void;
  onError?: (error: any) => void;
  onUploadProgress?: (event: any) => void;
  data: any;
  /** 限制上传文件大小 单位`mb`, 默认是300mb */
  limitSize: number;
}

/**
 * 主要是处理上传文件的进度
 */
export function axiosUpload({ onSuccess, onError, onUploadProgress, data, limitSize = 300 }: AxiosUpload) {
  const { files: file } = data;
  if (file.size > 1024 * 1024 * limitSize) {
    onError?.(new Error(`文件大小不能超过${limitSize}M`));
  }
  const formData = new FormData();
  formData.append('files', file);
  axios
    .post(`${import.meta.env.VITE_API_URL_PROXY}/file/upload`, formData, {
      headers: {
        'X-Token': getToken ?? '',
      },
      onUploadProgress: (event) => {
        if (event.total) {
          onUploadProgress?.(Math.round((event.loaded / event.total) * 10000) / 100.0);
        }
      },
    })
    .then((res) => onSuccess?.(res.data))
    .catch((error) => onError?.(error));
}
