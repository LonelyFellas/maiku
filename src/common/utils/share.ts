import { Constants } from '../datasource';

/**
 * Check if an object has a property.
 */
export function hasOwnProperty(obj: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export const hasToken = !['undefined', 'null'].includes(window.localStorage.getItem(Constants.LOCAL_TOKEN) || 'null');
