import { PreventDefaultIsExternalItemRequest } from './prevent-default-is-external-item.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { Injectable } from '@angular/core';
import { isExternalItem } from '../../is-external-item';

@Injectable()
@FExecutionRegister(PreventDefaultIsExternalItemRequest)
export class PreventDefaultIsExternalItemExecution
  implements IExecution<PreventDefaultIsExternalItemRequest, void>
{
  public handle(request: PreventDefaultIsExternalItemRequest): void {
    if (this._isTargetItemExternal(request.event)) {
      request.event.preventDefault();
    }
  }

  private _isTargetItemExternal(event: Event): boolean {
    const isTargetItemExternal = this._isExternalItem(event.target as HTMLElement);
    const isTargetParentItemExternal = this._isExternalItem(
      (event.target as Node).parentNode as HTMLElement,
    );

    return isTargetItemExternal || isTargetParentItemExternal;
  }

  private _isExternalItem(target: HTMLElement): boolean {
    let result = false;
    try {
      result = isExternalItem(target);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}

    return result;
  }
}
