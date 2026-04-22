import { InjectionToken } from '@angular/core';
import { IMediaLink } from './i-media-link';

export interface IMediaLinksProvider {

  getMediaLinks(): IMediaLink[];
}

export const MEDIA_LINKS_PROVIDER = new InjectionToken<IMediaLink[]>('MEDIA_LINKS_PROVIDER');
