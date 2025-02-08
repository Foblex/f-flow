import { IPageLink } from '../../i-page-link';

export class GetPreviousNextPageNavigationResponse {

  constructor(
    public previousLink: IPageLink | undefined,
    public nextLink: IPageLink | undefined
  ) {

  }
}
