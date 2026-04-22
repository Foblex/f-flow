import { inject, Injectable, signal } from '@angular/core';
import {
  IHeaderMenuLink,
  IMarkdownFooterNavigation,
  IMediaLink,
  IMediaLinksProvider,
  INavigationGroup,
  ITableOfContent,
  TableOfContentData,
} from '../components';
import { IHeaderConfiguration, IHeaderConfigurationStore } from '../../common';
import { DOCUMENTATION_CONFIGURATION } from '../domain';
import { IDynamicComponentItem, IShowcaseItem } from '../../dynamic-components';
import { calculateMarkdownUrl } from '../utils';

@Injectable()
export class DocumentationStore
  implements IMediaLinksProvider, IHeaderConfigurationStore {
  private readonly _configuration = inject(DOCUMENTATION_CONFIGURATION);

  public readonly tocData = signal<TableOfContentData>(new TableOfContentData([], []));

  public getMarkdownUrl(markdown: string): string {
    return calculateMarkdownUrl(
      markdown,
      (this._configuration.navigation || []),
      this._configuration.docsDir,
      this._configuration.notFoundMarkdown,
    );
  }

  public getLogo(): string {
    return this._configuration.logo;
  }

  public getTitle(): string {
    return this._configuration.title;
  }

  public getHeaderNavigation(): IHeaderMenuLink[] {
    return this._configuration.header?.navigation || [];
  }

  public getComponents(): IDynamicComponentItem[] {
    return this._configuration.components || [];
  }

  public getNavigation(): INavigationGroup[] {
    return this._configuration.navigation || [];
  }

  public getFooterNavigation(): IMarkdownFooterNavigation {
    return this._configuration.footer?.navigation || {};
  }

  public getMediaLinks(): IMediaLink[] {
    return this._configuration.header?.mediaLinks || [];
  }

  public getTableOfContent(): ITableOfContent | null {
    return this._configuration.tableOfContent;
  }

  public getHeader(): IHeaderConfiguration | undefined {
    return this._configuration.header;
  }

  public getShowcaseItems(): IShowcaseItem[] {
    return this._configuration.showcaseItems || [];
  }
}
