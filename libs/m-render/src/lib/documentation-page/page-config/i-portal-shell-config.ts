import { IHeaderMenuLink, IMediaLink } from '../components';

/**
 * Portal-wide shell: shared by every documentation section.
 * Defined ONCE per portal (not per section) to eliminate the
 * "header navigation duplicated 4× across config files" problem.
 */
export interface IPortalShellConfig {
  /** Application/site name, e.g. 'Foblex Flow' */
  appName: string;

  /** Document language, e.g. 'en' */
  language: string;

  /** Logo URL */
  logo: string;

  /** Public origin used to build absolute canonical/og URLs, e.g. 'https://flow.foblex.com' */
  origin: string;

  /** Path to the global 404 markdown file */
  notFoundMarkdown: string;

  header: {
    navigation: IHeaderMenuLink[];
    mediaLinks: IMediaLink[];
  };

  /** Defaults applied to section meta when a page does not override them. */
  defaultSeo: {
    locale: string;
    image: string;
    imageType: string;
    imageWidth: number;
    imageHeight: number;
    twitterCard?: string;
    twitterSite?: string;
    twitterCreator?: string;
    robots?: string;
  };
}
