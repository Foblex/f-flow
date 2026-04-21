import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FHeadTagService {

  private readonly _document = inject(DOCUMENT);

  public setTitle(title: string): void {
    this._document.title = title || '';
  }

  public setDescription(description?: string | null): void {
    this.updateNameTag({ name: 'description', content: description || '' });
  }

  public setCanonical(url?: string | null): void {
    const normalizedUrl = (url || '').trim();
    const link = this._getCanonical();
    if (!normalizedUrl) {
      if (link) {
        link.remove();
      }
      return;
    }

    const canonicalLink: HTMLLinkElement = link || this._createElement<HTMLLinkElement>('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', normalizedUrl);
  }

  private _getCanonical(): HTMLLinkElement | null {
    return this._document.querySelector(`link[rel="canonical"]`) || null;
  }

  public updateTag(tag: IMetaTag): void {
    this.updatePropertyTag(tag);
  }

  public updatePropertyTag(tag: IMetaTag): void {
    const normalizedContent = tag.content?.trim() || '';
    const meta = this._getPropertyTag(tag.property);
    if (!normalizedContent) {
      if (meta) {
        meta.remove();
      }
      return;
    }

    const targetMeta = meta || this._createElement<HTMLMetaElement>('meta');
    targetMeta.setAttribute('property', tag.property);
    targetMeta.setAttribute('content', normalizedContent);
  }

  public updateNameTag(tag: INameMetaTag): void {
    const normalizedContent = tag.content?.trim() || '';
    const meta = this._getNameTag(tag.name);
    if (!normalizedContent) {
      if (meta) {
        meta.remove();
      }
      return;
    }

    const targetMeta = meta || this._createElement<HTMLMetaElement>('meta');
    targetMeta.setAttribute('name', tag.name);
    targetMeta.setAttribute('content', normalizedContent);
  }

  private _getPropertyTag(property: string): HTMLMetaElement | null {
    return this._document.querySelector(`meta[property="${ property }"]`) || null;
  }

  private _getNameTag(name: string): HTMLMetaElement | null {
    return this._document.querySelector(`meta[name="${ name }"]`) || null;
  }

  private _createElement<TElement extends Node>(tag: string): TElement {
    const element = this._document.createElement(tag) as Node;
    const head = this._document.getElementsByTagName('head')[ 0 ];
    head.appendChild(element);

    return element as TElement;
  }
}

export interface IMetaTag {

  property: string;

  content: string;
}

export interface INameMetaTag {
  name: string;
  content: string;
}
