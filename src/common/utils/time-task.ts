import { isPromise } from '@darwish/utils-core';

export interface TimeTaskOptions<T> {
  type: T;
  maxAttempts?: number;
  timeout?: number;
  attempts?: number;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export default function timeTask(callback: () => boolean | (() => Promise<boolean>), options: TimeTaskOptions<'check'>): void;
export default function timeTask(callback: () => void | (() => Promise<void>), options: TimeTaskOptions<'action'>): void;
export default function timeTask(callback: () => boolean | void | (() => Promise<boolean | void>), options: TimeTaskOptions<'check' | 'action'>): void {
  const { type = 'action', maxAttempts = 5, timeout = 1000, onSuccess, onFailure } = options;
  let attempts = options.attempts ?? 0;

  const intervalId = setInterval(async () => {
    if (type === 'check') {
      let result: boolean | null = null;
      if (isPromise(callback)) {
        result = (await callback()) as boolean;
      } else {
        result = callback() as boolean;
      }
      if (result) {
        clearInterval(intervalId);
        onSuccess?.();
        return;
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        onFailure?.();
        return;
      }
    } else {
      if (isPromise(callback)) {
        await callback();
      } else {
        callback();
      }
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        onSuccess?.();
        return;
      }
    }
    attempts++;
  }, timeout);
}
