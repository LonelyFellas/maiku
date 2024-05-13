interface TaskCheckOptions {
  type: 'check';
  maxAttempts: number;
  timeout: number;
  attempts: number;
}

interface TaskTaskOptions {
  type: 'task';
  maxAttempts: number;
  timeout: number;
  attempts: number;
}

export function task(callback: () => boolean, options: TaskCheckOptions): void;
export function task(callback: () => void, options: TaskTaskOptions): void;
export function task(callback: () => boolean | void, options: TaskTaskOptions | TaskCheckOptions): void {
  const { type, maxAttempts, timeout, attempts } = options;
  // let attempts = 0;
  // let maxAttempts = 5;
  // let timeout = 1000;

  const intervalId = setInterval(() => {}, timeout);
}
