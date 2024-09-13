import { BrowserService } from '@foblex/platform';

export function createSVGElement<K extends keyof SVGElementTagNameMap>(tag: K, fBrowser: BrowserService): SVGElementTagNameMap[K] {
  return fBrowser.document.createElementNS('http://www.w3.org/2000/svg', tag);
}
