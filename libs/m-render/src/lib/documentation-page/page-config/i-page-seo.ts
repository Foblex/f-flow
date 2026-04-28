export interface IPageSeo {
  title: string;

  description: string;

  canonical?: string;

  image?: string;

  imageDark?: string;

  imageWidth?: number;

  imageHeight?: number;

  imageType?: string;

  /** og:type override, e.g. 'article' for blog posts (defaults to the section's type, usually 'website') */
  ogType?: string;

  /**
   * Per-page override of the section's `appendAppNameToTitle` setting.
   *
   * - `true`: this page's title is final, do NOT append " | <appName>".
   * - `false`: append " | <appName>" even when the section default is to not append.
   * - omitted: inherit the section default.
   */
  titleIsFinal?: boolean;
}
