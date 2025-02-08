import { IHandler } from '@foblex/mediator';
import { GetAbsoluteTopToContainerRequest } from './get-absolute-top-to-container.request';

export class GetAbsoluteTopToContainerHandler implements IHandler<GetAbsoluteTopToContainerRequest, number> {

  public handle(request: GetAbsoluteTopToContainerRequest): number {
    let element = request.element;
    let result: number = 0;

    while (element !== request.container) {
      if (!element) return NaN;
      result += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }

    return result;
  }
}
