import { DOCUMENT, ɵDomAdapter as DomAdapter, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { IJsonLD } from './i-json-ld';

@Injectable({ providedIn: 'root' })
export class FJsonLdService {

  private _dom: DomAdapter;

  constructor(@Inject(DOCUMENT) private _document: any) {
    this._dom = getDOM();
  }

  public update(data: IJsonLD): void {
    this.cleanup();
    const script = this.createScript();
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": data.name,
      "url": data.url,
      "description": data.description,
      "creator": {
        "@type": "Organization",
        "name": data.creator.name,
        "url": data.creator.url,
        "logo": data.creator.logo,
        "sameAs": data.creator.sameAs
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.mainEntityOfPage.id
      }
    });
  }

  private cleanup(): void {
    this._document.querySelectorAll(`script[type="application/ld+json"]`).forEach((x: any) => x.remove());
  }

  private createScript(): HTMLScriptElement {
    const element = this._dom.createElement('script') as HTMLScriptElement;
    const head = this._document.getElementsByTagName('head')[ 0 ];
    head.appendChild(element);
    return element;
  }
}

