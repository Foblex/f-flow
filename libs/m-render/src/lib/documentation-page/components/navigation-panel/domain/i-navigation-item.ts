/* eslint-disable @typescript-eslint/naming-convention */
import { INavigationItemBadge } from './i-navigation-item-badge';

export interface INavigationItem {
  link: string;

  text: string;

  hideToc?: boolean;

  pageTitle?: string;

  /** When true, pageTitle is the final <title>; the meta service will NOT append " | <appName>". */
  pageTitleIsFinal?: boolean;

  description?: string;

  canonical?: string;

  image?: string;

  image_dark?: string;

  image_width?: number;

  image_height?: number;

  image_type?: string;

  og_type?: string;

  badge?: INavigationItemBadge;

  date?: Date;
}
