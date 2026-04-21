import { IMarkdownFooterNavigation, INavigationGroup, ITableOfContent } from '../components';
import {
  IHasHeaderConfiguration,
  ILanguageConfiguration,
  ILogoConfiguration,
  ITitleConfiguration,
} from '../../common';
import { IMetaData } from '../analytics';
import { IDynamicComponentItem, IShowcaseItem } from '../../dynamic-components';

export interface IDocumentationConfiguration
  extends ILanguageConfiguration, ITitleConfiguration, ILogoConfiguration, IHasHeaderConfiguration {

  docsDir: string;

  notFoundMarkdown: string;

  navigation: INavigationGroup[];

  blogNavigation?: boolean;

  footer?: IDocumentationFooterConfiguration;

  components?: IDynamicComponentItem[];

  tableOfContent: ITableOfContent | null;

  meta?: IMetaData;

  showcaseItems?: IShowcaseItem[];
}

export interface IDocumentationFooterConfiguration {

  navigation?: IMarkdownFooterNavigation;
}
