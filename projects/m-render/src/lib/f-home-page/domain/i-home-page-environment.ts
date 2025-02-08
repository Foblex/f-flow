import { IDocsHeaderNavigationItem, IDocsSocialLink, IDocsVersion } from '../../domain';
import { IHomePageHero } from './i-home-page-hero';
import { IHomePageLink } from './i-home-page-link';
import { IHomePageFeature } from './i-home-page-feature';
import { IHomePageFooter } from './i-home-page-footer';
import { Type } from '@angular/core';

export interface IHomePageEnvironment {

  logo: string;

  title: string;

  version?: IDocsVersion;

  headerNavigation?: IDocsHeaderNavigationItem[];

  backgroundComponent?: Type<any>;

  hero: IHomePageHero;

  heroImageComponent?: Type<any>;

  buttons: IHomePageLink[];

  features: IHomePageFeature[];

  footer: IHomePageFooter;
}
