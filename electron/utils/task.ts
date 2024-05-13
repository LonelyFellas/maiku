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
  const handleFailure = () => {
    clearInterval(intervalId);
    onFailure?.();
    return;
  };

  const handleSuccess = () => {
    clearInterval(intervalId);
    onSuccess?.();
    return;
  };

  intervalId = setInterval(() => {
    if (type === 'check') {
      const result = callback() as boolean;
      if (result) {
        console.log('Task succeeded');
        handleSuccess();
      } else if (attempts >= maxAttempts) {
        console.log('Task failed1');
        handleFailure();
      }
    } else {
      callback() as void;
      if (attempts >= maxAttempts) {
        handleSuccess();
      }
    }
    attempts++;
  }, timeout);
}
