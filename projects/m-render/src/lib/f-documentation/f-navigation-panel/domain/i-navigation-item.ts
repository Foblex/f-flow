import { INavigationItemBadge } from './i-navigation-item-badge';

export interface INavigationItem {

  link: string;

  text: string;

  hideToc?: boolean;

  description?: string;

  image?: string;

  image_dark?: string;

  image_width?: number;

  image_height?: number;

  image_type?: string;

  badge?: INavigationItemBadge;

  date?: Date;
}

