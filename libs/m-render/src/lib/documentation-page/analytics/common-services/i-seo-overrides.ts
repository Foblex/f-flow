import { IMetaData } from './i-meta-data';

export interface ISeoOverrides extends Partial<IMetaData> {
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}
