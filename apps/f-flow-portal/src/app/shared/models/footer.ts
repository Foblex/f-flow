export interface IFooterLink {
  text: string;

  routerLink?: string;

  /**
   * Optional `#fragment` to append to routerLink. Pages that render
   * shared content in a custom scroll container (e.g. services)
   * subscribe to `route.fragment` and manually scroll the section
   * matching this id into view, since Angular's default anchor
   * scrolling only works against the window.
   */
  fragment?: string;

  href?: string;
}

export interface IFooterColumn {
  title: string;

  links: IFooterLink[];
}
