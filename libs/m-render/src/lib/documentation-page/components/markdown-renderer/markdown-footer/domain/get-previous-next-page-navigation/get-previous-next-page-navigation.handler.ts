import { GetPreviousNextPageNavigationRequest } from './get-previous-next-page-navigation.request';
import { GetPreviousNextPageNavigationResponse } from './get-previous-next-page-navigation.response';
import { IMarkdownFooterLink } from '../i-markdown-footer-link';
import { DocumentationStore } from '../../../../../services';

export class GetPreviousNextPageNavigationHandler {

  constructor(
    private _provider: DocumentationStore,
  ) {
  }

  public handle(request: GetPreviousNextPageNavigationRequest): GetPreviousNextPageNavigationResponse {
    let previous: IMarkdownFooterLink | undefined = undefined;
    let next: IMarkdownFooterLink | undefined = undefined;

    this._provider.getNavigation().forEach((group, groupIndex: number) => {
      (group.items || []).forEach((item, index) => {
        if (item.link === request.currentLink) {
          if (index > 0) {
            previous = { ...group.items[ index - 1 ] };
          } else {
            if (groupIndex > 0) {
              const previousGroup = this._provider.getNavigation()[ groupIndex - 1 ];
              previous = { ...previousGroup.items[ previousGroup.items.length - 1 ] };
            }
          }
          if (index < group.items.length - 1) {
            next = { ...group.items[ index + 1 ] };
          } else {
            if (groupIndex < this._provider.getNavigation().length - 1) {
              const nextGroup = this._provider.getNavigation()[ groupIndex + 1 ];
              next = { ...nextGroup.items[ 0 ] };
            }
          }
        }
      });
    });
    return new GetPreviousNextPageNavigationResponse(previous, next);
  }
}
