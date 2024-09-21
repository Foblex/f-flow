import { TransformModelExtensions } from '@foblex/2d';
import { AddPatternToBackgroundRequest } from './add-pattern-to-background.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { FBackgroundBase } from '../../../f-backgroud';

let uniqueId: number = 0;

@Injectable()
@FExecutionRegister(AddPatternToBackgroundRequest)
export class AddPatternToBackgroundExecution implements IExecution<AddPatternToBackgroundRequest, void> {

  private get fBackground(): FBackgroundBase {
    return this.fComponentsStore.fBackground!;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: AddPatternToBackgroundRequest): void {
    const children = request.fPattern?.hostElement.getElementsByTagName('pattern') || [];
    const pattern = children.length ? children[ 0 ] : undefined;
    if (pattern) {
      const defs = createSVGElement('defs', this.fBrowser);
      pattern.id = 'f-background-pattern-' + uniqueId++;
      request.fPattern?.hostElement.remove();
      defs.appendChild(pattern);
      this.fBackground.hostElement?.firstChild?.appendChild(defs);
      const rect = createSVGElement('rect', this.fBrowser);
      rect.setAttribute('fill', 'url(#' + pattern.id + ')');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      this.fBackground.hostElement.firstChild?.appendChild(rect);
      const transform = this.fComponentsStore.fCanvas?.transform || TransformModelExtensions.default();
      request.fPattern?.setTransform(transform);
    }
  }
}
