import { IJsonLdCreator } from './i-json-ld-creator';
import { IJsonLdEntityOfPage } from './i-json-ld-entity-of-page';

export interface IJsonLD {

  name: string;

  url: string;

  description: string;

  creator: IJsonLdCreator;

  mainEntityOfPage: IJsonLdEntityOfPage;
}
