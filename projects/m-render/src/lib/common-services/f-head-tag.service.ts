import { DOCUMENT, ɵDomAdapter as DomAdapter, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FHeadTagService {

  private _dom: DomAdapter;

  constructor(@Inject(DOCUMENT) private _document: any) {
    this._dom = getDOM();
  }

  public setTitle(title: string): void {
    this._document.title = title || '';
  }

  public setDescription(description: string): void {
    const meta: HTMLMetaElement = this.getDescription() || this.createElement<HTMLMetaElement>('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', description);
  }

  private getDescription(): HTMLMetaElement | null {
    return this._document.querySelector(`meta[name="description"]`) || null;
  }

  public setCanonical(url: string): void {
    const link: HTMLLinkElement = this.getCanonical() || this.createElement<HTMLLinkElement>('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
  }

  private getCanonical(): HTMLLinkElement | null {
    return this._document.querySelector(`link[rel="canonical"]`) || null;
  }

  public updateTag(tag: IMetaTag): void {
    const meta = this.getMetaTag(tag) || this.createElement<HTMLMetaElement>('meta');
    meta.setAttribute('property', tag.property);
    meta.setAttribute('content', tag.content);
  }

  private getMetaTag(tag: IMetaTag): HTMLMetaElement | null {
    return this._document.querySelector(`meta[property="${ tag.property }"]`) || null;
  }

  private createElement<TElement>(tag: string): TElement {
    const element = this._dom.createElement(tag) as TElement;
    const head = this._document.getElementsByTagName('head')[ 0 ];
    head.appendChild(element);
    return element;
  }
}

export interface IMetaTag {

  property: string;

  content: string;
}
