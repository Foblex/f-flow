import { IMarkdownFooterLink } from '../i-markdown-footer-link';

export class GetPreviousNextPageNavigationResponse {

  constructor(
    public previousLink: IMarkdownFooterLink | undefined,
    public nextLink: IMarkdownFooterLink | undefined,
  ) {

  }
}
