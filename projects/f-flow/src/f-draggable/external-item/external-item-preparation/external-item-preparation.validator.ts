import { Injectable } from '@angular/core';
import { ExternalItemPreparationRequest } from './external-item-preparation.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FExternalItemBase, FExternalItemService, getExternalItem, isExternalItem } from '../../../f-external-item';

@Injectable()
@FValidatorRegister(ExternalItemPreparationRequest)
export class ExternalItemPreparationValidator implements IValidator<ExternalItemPreparationRequest> {


  constructor(
    private fExternalItemService: FExternalItemService
  ) {
  }

  public handle(request: ExternalItemPreparationRequest): boolean {
    const externalItem = this.getExternalItem(request.event.targetElement);
    return isExternalItem(request.event.targetElement) && !!externalItem && !externalItem.fDisabled;
  }

  private getExternalItem(targetElement: HTMLElement): FExternalItemBase<any> | undefined {
    return this.fExternalItemService.getItem(getExternalItem(targetElement));
  }
}
