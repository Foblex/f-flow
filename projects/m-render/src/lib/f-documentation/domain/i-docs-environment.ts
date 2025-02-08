import { INavigationGroup } from '../f-navigation-panel';
import { IDocsSocialLink } from '../../domain';
import { IDocsComponent } from '../../domain';
import { IDocsVersion } from '../../domain';
import { IDocsFooterNavigation } from '../../domain';
import { IDocsTableOfContent } from '../../domain';
import { IDocsHeaderNavigationItem } from '../../domain';

export interface IDocsEnvironment {

  lang: string;

  docsDir: string;

  notFoundMD: string;

  logo: string;

  title: string;

  version?: IDocsVersion;

  headerNavigation?: IDocsHeaderNavigationItem[];

  navigation: INavigationGroup[];

  footerNavigation?: IDocsFooterNavigation;

  components?: IDocsComponent[];

  socialLinks?: IDocsSocialLink[];

  toC?: IDocsTableOfContent;
}
