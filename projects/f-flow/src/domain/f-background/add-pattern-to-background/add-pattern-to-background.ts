import { TransformModelExtensions } from '@foblex/2d';
import { AddPatternToBackgroundRequest } from './add-pattern-to-background.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';

let uniqueId = 0;

/**
 * Execution that adds a pattern to the background in the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddPatternToBackgroundRequest)
export class AddPatternToBackground implements IExecution<AddPatternToBackgroundRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);

  private get _backgroundElement(): HTMLElement {
    return this._store.fBackground?.hostElement!;
  }

  public handle(request: AddPatternToBackgroundRequest): void {
    const patterns = this._getPatterns(request.fPattern?.hostElement);
    if (!patterns?.length) {
      return;
    }
    const defs = createSVGElement('defs', this._browser);
    request.fPattern?.hostElement.remove();

    patterns.forEach((pattern) => {
      defs.append(pattern);
    });

    if (patterns.length) {
      this._backgroundElement?.firstChild?.appendChild(defs);
      patterns[patterns.length - 1].id = 'f-background-pattern-' + uniqueId++;
      const lastPatternId = patterns[patterns.length - 1].id;
      const rect = createSVGElement('rect', this._browser);
      rect.setAttribute('fill', 'url(#' + lastPatternId + ')');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      this._backgroundElement.firstChild?.appendChild(rect);
      const transform = this._store.fCanvas?.transform || TransformModelExtensions.default();
      request.fPattern?.setTransform(transform);
    }
  }

  private _getPatterns(element?: HTMLElement | SVGElement | undefined): SVGPatternElement[] {
    return Array.from(element?.getElementsByTagName('pattern') || []);
  }
}
