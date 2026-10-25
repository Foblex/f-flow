export interface IWindowService {
  getComputedStyle(element: Element): CSSStyleDeclaration;

  innerWidth: number;

  innerHeight: number;

  pageXOffset: number;

  pageYOffset: number;

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  isMediaQuery(query: string): boolean;

  requestAnimationFrame(callback: FrameRequestCallback): number;

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  location:
    | Location
    | { href: string; pathname: string; search: string; hash: string; origin: string };

  /**
   * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
   */
  open(url?: string, target?: string, features?: string): void;
}
