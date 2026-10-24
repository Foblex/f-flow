import { Injectable } from '@angular/core';
import { IWindowService } from './i-window-service';

@Injectable({ providedIn: 'root' })
export class ServerWindowService implements IWindowService {
  public readonly innerWidth: number = 0;

  public readonly innerHeight: number = 0;

  public readonly pageXOffset: number = 0;

  public readonly pageYOffset: number = 0;

  public getComputedStyle(_element: Element): CSSStyleDeclaration {
    const stub = {
      getPropertyValue: (_property: string) => '0',
    };

    return new Proxy(stub, {
      get: (target, prop) => {
        if (prop === 'getPropertyValue') {
          return target.getPropertyValue;
        }

        return '0';
      },
    }) as unknown as CSSStyleDeclaration;
  }

  public isMediaQuery(_query: string): boolean {
    return false;
  }

  public requestAnimationFrame(callback: FrameRequestCallback): number {
    return setTimeout(callback, 0);
  }

  public get location(): {
    href: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
  } {
    return { href: '', pathname: '', search: '', hash: '', origin: '' };
  }

  public open(_url?: string, _target?: string, _features?: string): void {
    // Server environment has no window to open anything in.
  }
}
