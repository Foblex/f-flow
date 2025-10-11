import { IRect, RectExtensions } from '@foblex/2d';

type CachedRect = {
  rect: IRect;
  version: number;
  invalidated: boolean;
};

const elementCache = new WeakMap<Element, CachedRect>();
const observedElements = new WeakMap<Element, Document>();
const windowsWithListeners = new WeakSet<Window>();
const mutationObservers = new WeakMap<Document, MutationObserver>();
const resizeObservers = new WeakMap<Document, ResizeObserver>();

let globalVersion = 0;

const originalFromElement = RectExtensions.fromElement.bind(RectExtensions);

const invalidateElement = (element: Element): void => {
  const cached = elementCache.get(element);
  if (cached) {
    cached.invalidated = true;
  }
};

const ensureViewportListeners = (element: Element): void => {
  const ownerDocument = element.ownerDocument;
  const defaultView = ownerDocument?.defaultView;

  if (!defaultView || windowsWithListeners.has(defaultView)) {
    return;
  }

  const invalidateAll = (): void => {
    globalVersion++;
  };

  defaultView.addEventListener('scroll', invalidateAll, true);
  defaultView.addEventListener('resize', invalidateAll);
  ownerDocument?.addEventListener?.('scroll', invalidateAll, true);

  windowsWithListeners.add(defaultView);
};

const ensureObservers = (element: Element): void => {
  const ownerDocument = element.ownerDocument;
  if (!ownerDocument || observedElements.get(element) === ownerDocument) {
    return;
  }

  observedElements.set(element, ownerDocument);

  if (typeof MutationObserver !== 'undefined') {
    let mutationObserver = mutationObservers.get(ownerDocument);

    if (!mutationObserver) {
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const target = mutation.target;
          if (target instanceof Element) {
            invalidateElement(target);
          }
        }
      });

      mutationObservers.set(ownerDocument, mutationObserver);
    }

    mutationObserver.observe(element, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  if (typeof ResizeObserver !== 'undefined') {
    let resizeObserver = resizeObservers.get(ownerDocument);

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const target = entry.target;
          if (target instanceof Element) {
            invalidateElement(target);
          }
        }
      });

      resizeObservers.set(ownerDocument, resizeObserver);
    }

    try {
      resizeObserver.observe(element);
    } catch {
      // Some browsers throw for SVG or detached hosts; ignore to keep caching functional.
    }
  }
};

RectExtensions.fromElement = function (element: HTMLElement | SVGElement | null): IRect {
  if (!element) {
    return RectExtensions.initialize();
  }

  ensureViewportListeners(element);
  ensureObservers(element);

  let cached = elementCache.get(element);

  if (!cached) {
    cached = {
      rect: RectExtensions.initialize(),
      version: -1,
      invalidated: true,
    };

    elementCache.set(element, cached);
  }

  if (cached.invalidated || cached.version !== globalVersion) {
    cached.rect = originalFromElement(element);
    cached.invalidated = false;
    cached.version = globalVersion;
  }

  return RectExtensions.copy(cached.rect);
};
