import { IPoint } from '@foblex/2d';

export interface ElementOptions {
  id?: string;
  classes?: readonly string[];
  dataset?: Readonly<Record<string, string>>;
}

function applyElementOptions<T extends HTMLElement | SVGElement>(
  element: T,
  options: ElementOptions = {},
): T {
  if (options.id) {
    element.id = options.id;
  }

  options.classes?.forEach((className) => element.classList.add(className));

  Object.entries(options.dataset ?? {}).forEach(([key, value]) => {
    element.dataset[key] = value;
  });

  return element;
}

export interface PureHarness {
  point(x: number, y: number): IPoint;
  element(tag?: keyof HTMLElementTagNameMap, options?: ElementOptions): HTMLElement;
  svg(tag?: keyof SVGElementTagNameMap, options?: ElementOptions): SVGElement;
}

export function createPureHarness(): PureHarness {
  return {
    point(x: number, y: number): IPoint {
      return { x, y };
    },

    element(tag: keyof HTMLElementTagNameMap = 'div', options?: ElementOptions): HTMLElement {
      return applyElementOptions(document.createElement(tag), options);
    },

    svg(tag: keyof SVGElementTagNameMap = 'g', options?: ElementOptions): SVGElement {
      const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

      return applyElementOptions(element, options);
    },
  };
}
