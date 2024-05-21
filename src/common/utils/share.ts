/**
 * Check if an object has a property.
 */
export function hasOwnProperty(obj: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
