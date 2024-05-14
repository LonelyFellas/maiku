interface TaskOptions<T> {
  type: T;
  maxAttempts?: number;
  timeout?: number;
  attempts?: number;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export function task(callback: () => boolean, options: TaskOptions<'check'>): void;
export function task(callback: () => void, options: TaskOptions<'action'>): void;
export function task(callback: () => boolean | void, options: TaskOptions<'check' | 'action'>): void {
  const { type = 'action', maxAttempts = 5, timeout = 1000, onSuccess, onFailure } = options;
  let attempts = options.attempts ?? 0;
  let intervalId: NodeJS.Timeout;

  intervalId = setInterval(() => {
    if (type === 'check') {
      const result = callback() as boolean;
      if (result) {
        console.log('result', result);
        clearInterval(intervalId);
        onSuccess?.();
        return;
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        onFailure?.();
        return;
      }
    } else {
      callback() as void;
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        onSuccess?.();
        return;
      }
    }
    attempts++;
  }, timeout);
}
