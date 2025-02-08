import { IHandler } from '@foblex/mediator';
import { GetPreviousNextPageNavigationRequest } from './get-previous-next-page-navigation.request';
import { GetPreviousNextPageNavigationResponse } from './get-previous-next-page-navigation.response';
import { IPageLink } from '../../i-page-link';
import { FDocumentationEnvironmentService } from '../../../../../f-documentation-environment.service';

export class GetPreviousNextPageNavigationHandler
  implements IHandler<GetPreviousNextPageNavigationRequest, GetPreviousNextPageNavigationResponse> {

  constructor(
    private fEnvironmentService: FDocumentationEnvironmentService
  ) {
  }

  public handle(request: GetPreviousNextPageNavigationRequest): GetPreviousNextPageNavigationResponse {
    let previous: IPageLink | undefined = undefined;
    let next: IPageLink | undefined = undefined;

    this.fEnvironmentService.getNavigation().forEach((group, groupIndex: number) => {
      (group.items || []).forEach((item, index) => {
        if (item.link === request.currentLink) {
          if (index > 0) {
            previous = { ...group.items[ index - 1 ] };
          } else {
            if (groupIndex > 0) {
              const previousGroup = this.fEnvironmentService.getNavigation()[ groupIndex - 1 ];
              previous = { ...previousGroup.items[ previousGroup.items.length - 1 ] };
            }
          }
          if (index < group.items.length - 1) {
            next = { ...group.items[ index + 1 ] };
          } else {
            if (groupIndex < this.fEnvironmentService.getNavigation().length - 1) {
              const nextGroup = this.fEnvironmentService.getNavigation()[ groupIndex + 1 ];
              next = { ...nextGroup.items[ 0 ] };
            }
          }
        }
      });
    });
    return new GetPreviousNextPageNavigationResponse(previous, next);
  }
}
