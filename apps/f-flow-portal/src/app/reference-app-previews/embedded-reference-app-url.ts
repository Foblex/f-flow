import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function useEmbeddedReferenceAppUrl(
  appName: string,
  devPort: number,
): { url: string; safeUrl: SafeResourceUrl } {
  const document = inject(DOCUMENT);
  const sanitizer = inject(DomSanitizer);
  const location = document.defaultView?.location;

  const url = !location
    ? `/embedded/${appName}/`
    : isLocalHost(location.hostname)
      ? `${location.protocol}//${location.hostname}:${devPort}/`
      : `${location.origin}/embedded/${appName}/`;

  return {
    url,
    safeUrl: sanitizer.bypassSecurityTrustResourceUrl(url),
  };
}
