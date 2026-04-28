import { InjectionToken } from '@angular/core';

/**
 * App-side hook for opening a custom search dialog.
 *
 * When provided, m-render's header search button delegates clicks to
 * this trigger instead of trying to load Algolia DocSearch from the
 * `IHeaderSearchConfiguration`. Lets the portal own its search UX
 * (including a custom semantic-search dialog) while keeping the search
 * button visually consistent across docs/examples/blog/showcase pages.
 */
export interface ISearchTrigger {
  open(): void;
}

export const SEARCH_TRIGGER = new InjectionToken<ISearchTrigger>('SEARCH_TRIGGER');
