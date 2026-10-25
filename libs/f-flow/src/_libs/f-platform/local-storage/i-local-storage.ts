/**
 * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
 */
export interface ILocalStorage {
  setItem(key: string, value: string): void;

  getItem(key: string): string | null;

  removeItem(key: string): void;

  clear(): void;
}
