import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from 'electron';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const isProd = app.isPackaged;
export const isMac = process.platform === 'darwin';
