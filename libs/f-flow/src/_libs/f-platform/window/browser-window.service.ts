import { Injectable } from '@angular/core';
import { IWindowService } from './i-window-service';

@Injectable({ providedIn: 'root' })
export class BrowserWindowService implements IWindowService {
  public getComputedStyle(element: Element): CSSStyleDeclaration {
    return window.getComputedStyle(element);
  }

  public get innerWidth(): number {
    return window.innerWidth;
  }

  public get innerHeight(): number {
    return window.innerHeight;
  }

  public get pageXOffset(): number {
    return window.pageXOffset;
  }

  public get pageYOffset(): number {
    return window.pageYOffset;
  }

  public isMediaQuery(query: string): boolean {
    return window.matchMedia(query).matches;
  }

  public requestAnimationFrame(callback: FrameRequestCallback): number {
    return window.requestAnimationFrame(callback);
  }

  public get location(): Location {
    return window.location;
  }

  public open(url?: string, target?: string, features?: string): void {
    window.open(url, target, features);
  }
}
