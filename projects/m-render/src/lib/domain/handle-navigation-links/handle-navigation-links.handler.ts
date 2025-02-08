import { IHandler } from '@foblex/mediator';
import { HandleNavigationLinksRequest } from './handle-navigation-links.request';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserService } from '@foblex/platform';

@Injectable()
export class HandleNavigationLinksHandler implements IHandler<HandleNavigationLinksRequest, void> {

  constructor(
    private router: Router,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: HandleNavigationLinksRequest): void {
    const target = request.event.target as HTMLElement;

    if (this.isAnchorTag(target) && this.hasHref(target)) {
      const href = target.getAttribute('href')!;
      request.event.preventDefault();
      if (!this.isExternalLink(href)) {
        this.navigateInternalLink(href);
      } else {
        this.openExternalLink(href);
      }
    }
  }

  private isAnchorTag(element: HTMLElement): boolean {
    return element.tagName === 'A';
  }

  private hasHref(element: HTMLElement): boolean {
    return element.hasAttribute('href');
  }

  private isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  private navigateInternalLink(href: string): void {
    if(href.startsWith('/')) {
      href = href.substring(1);
    }
    this.router.navigate([href]).then();
  }

  private replaceAfterLastSlash(input: string, replacement: string): string {
    const lastSlashIndex = input.lastIndexOf('/');
    return lastSlashIndex !== -1 ? input.substring(0, lastSlashIndex + 1) + replacement : input;
  }

  private openExternalLink(href: string): void {
    this.fBrowser.window.open(href, '_blank');
  }
}
