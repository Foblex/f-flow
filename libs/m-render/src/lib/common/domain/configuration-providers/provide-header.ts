import { IHeaderMenuLink, IMediaLink } from '../../../documentation-page';

export interface IHeaderConfiguration {

  search?: boolean;
  searchConfiguration?: IHeaderSearchConfiguration;

  navigation?: IHeaderMenuLink[];

  mediaLinks?: IMediaLink[];
}

export interface IHasHeaderConfiguration {

  header?: IHeaderConfiguration;
}

export interface IHeaderSearchConfiguration {
  appId: string;
  apiKey: string;
  indexName: string;
  placeholder?: string;
  insights?: boolean;
  searchParameters?: Record<string, unknown>;
}
