export interface ICanRunOutsideAngular {
  runOutsideAngular<T>(fn: (...args: any[]) => T): T;
}
