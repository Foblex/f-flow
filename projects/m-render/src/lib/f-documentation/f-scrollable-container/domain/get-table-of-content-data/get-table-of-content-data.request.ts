export class GetTableOfContentDataRequest {

  constructor(
    public fMarkdownPage: HTMLElement,
    public tocRange?: {
      start: number,
      end: number
    }
  ) {
  }
}
