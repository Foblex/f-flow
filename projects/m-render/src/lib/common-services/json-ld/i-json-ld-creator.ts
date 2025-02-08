export interface IJsonLdCreator {

  type: 'Person' | 'Organization';

  name: string;

  url: string;

  logo: string;

  sameAs: string[];
}
