import { INavigationGroup, INavigationItem } from '../../components';

export function defineNavigationGroup(name: string | undefined, items: INavigationItem[]): INavigationGroup {
  return {
    text: name,
    items,
  };
}
