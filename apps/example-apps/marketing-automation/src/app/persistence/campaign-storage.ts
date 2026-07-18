import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { EFLayoutDirection } from '@foblex/flow';
import { ICampaignDocument } from './i-campaign-document';

const STORAGE_KEY = 'foblex-campaign-studio-v1';

@Injectable()
export class CampaignStorage {
  private readonly _document = inject(DOCUMENT);

  public load(): ICampaignDocument | null {
    const value = this._document.defaultView?.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return null;
    }

    try {
      const document = JSON.parse(value) as Partial<ICampaignDocument>;
      if (
        !document.snapshot ||
        !Array.isArray(document.snapshot.nodes) ||
        !Array.isArray(document.snapshot.connections)
      ) {
        return null;
      }

      return {
        direction:
          document.direction === EFLayoutDirection.LEFT_RIGHT
            ? EFLayoutDirection.LEFT_RIGHT
            : EFLayoutDirection.TOP_BOTTOM,
        snapshot: {
          ...document.snapshot,
          groups: Array.isArray(document.snapshot.groups) ? document.snapshot.groups : [],
        },
      } as ICampaignDocument;
    } catch {
      return null;
    }
  }

  public save(document: ICampaignDocument): void {
    this._document.defaultView?.localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
  }

  public clear(): void {
    this._document.defaultView?.localStorage.removeItem(STORAGE_KEY);
  }
}
