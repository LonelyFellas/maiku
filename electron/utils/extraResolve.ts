import path, { resolve} from "node:path"
import {fileURLToPath} from "node:url";

const isPackaged = process.env.NODE_ENV === "production"
/**
 * Resolve the path of the extra resource.
 * @param value
 */
export function extraResolve(value: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return isPackaged ? resolve(process.resourcesPath, `../lib/extra/${value}`) : resolve(path.join(__dirname, `../electron/resources/extra/${value}`));
}