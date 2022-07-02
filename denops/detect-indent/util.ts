export function isEmptyObject(object: Record<string, unknown>): boolean {
  for (const prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) {
      return false;
    }
  }

  return true;
}
