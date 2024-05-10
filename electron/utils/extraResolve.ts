import path, { resolve} from "node:path"
import { app } from "electron";
import {fileURLToPath} from "node:url";

/**
 * Resolve the path of the extra resource.
 * @param value
 */
export function extraResolve(value: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return app.isPackaged ? resolve(path.join(process.resourcesPath, `../lib/extra/${value}`)) : resolve(path.join(__dirname, `../electron/resources/extra/${value}`));
}