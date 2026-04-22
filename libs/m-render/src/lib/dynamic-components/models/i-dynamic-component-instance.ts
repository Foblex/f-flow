/**
 * Interface for dynamic component instances.
 * This interface can be implemented by any dynamic component to ensure it has an initialize method
 * and can accept properties dynamically.
 */
export interface IDynamicComponentInstance {
  initialize?(): void;
  [prop: string]: unknown | { set(value: unknown): void };
}
