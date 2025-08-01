import { TransformModelExtensions } from '@foblex/2d';
import { AddPatternToBackgroundRequest } from './add-pattern-to-background.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { FBackgroundBase } from '../../../f-backgroud';

let uniqueId: number = 0;

/**
 * Execution that adds a pattern to the background in the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddPatternToBackgroundRequest)
export class AddPatternToBackgroundExecution implements IExecution<AddPatternToBackgroundRequest, void> {

  private readonly _store = inject(FComponentsStore);
  private readonly _fBrowser = inject(BrowserService);

  private get _fBackground(): FBackgroundBase {
    return this._store.fBackground!;
  }

  public handle(request: AddPatternToBackgroundRequest): void {
    const children = request.fPattern?.hostElement.getElementsByTagName('pattern') || [];
    const pattern = children.length ? children[ 0 ] : undefined;
    if (pattern) {
      const defs = createSVGElement('defs', this._fBrowser);
      pattern.id = 'f-background-pattern-' + uniqueId++;
      request.fPattern?.hostElement.remove();
      defs.appendChild(pattern);
      this._fBackground.hostElement?.firstChild?.appendChild(defs);
      const rect = createSVGElement('rect', this._fBrowser);
      rect.setAttribute('fill', 'url(#' + pattern.id + ')');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      this._fBackground.hostElement.firstChild?.appendChild(rect);
      const transform = this._store.fCanvas?.transform || TransformModelExtensions.default();
      request.fPattern?.setTransform(transform);
    }
  }
}
