import { INavigationItem } from './i-navigation-item';

export interface INavigationGroup {

  text?: string;

  items: INavigationItem[];
}
