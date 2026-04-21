import { ActivateTocByHashRequest } from './activate-toc-by-hash-request';
import { inject, Injectable } from '@angular/core';
import { IExecution, MExecution } from '../../../../../mediatr';
import { DocumentationStore } from '../../../../services';

@Injectable()
@MExecution(ActivateTocByHashRequest)
export class ActivateTocByHash implements IExecution<ActivateTocByHashRequest, void>{

  private readonly _dataProvider = inject(DocumentationStore);

  public handle(payload: ActivateTocByHashRequest): void {
    this._dataProvider.tocData.update((data) => ({
      ...data,
      flat: data.flat.map((x) => ({
        ...x,
        isActive: x.hash === payload.hash,
      })),
    }));
  }
}
