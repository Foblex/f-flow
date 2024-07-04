import {
  ChangeDetectionStrategy,
  Component, ElementRef, Inject
} from "@angular/core";
import { IHasHostElement } from '@foblex/core';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { F_CONNECTION } from '../f-connection.injection-token';

@Component({
  selector: "path[fConnectionSelection]",
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection-selection",
    '[attr.id]': 'connectionForSelectionId',
  },
})
export class FConnectionSelectionComponent implements IHasHostElement {

  public get connectionForSelectionId(): string {
    return F_CONNECTION_IDENTIFIERS.connectionForSelectionId(
      this.base.fConnectionId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get hostElement(): SVGPathElement {
    return this.elementReference.nativeElement;
  }

  constructor(
      private elementReference: ElementRef<SVGPathElement>,
      @Inject(F_CONNECTION) private base: IHasConnectionFromTo,
  ) {
  }

  public setPath(path: string) {
    this.hostElement.setAttribute("d", `${ path }`);
  }
}

