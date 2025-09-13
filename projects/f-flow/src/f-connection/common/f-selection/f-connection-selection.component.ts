import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { F_CONNECTION } from '../f-connection.injection-token';
import { IHasHostElement } from '../../../i-has-host-element';

@Component({
  selector: 'path[fConnectionSelection]',
  template: '',
  styleUrls: ['./f-connection-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-selection',
    '[attr.id]': 'connectionForSelectionId',
  },
})
export class FConnectionSelectionComponent implements IHasHostElement {
  public readonly hostElement = inject(ElementRef<SVGPathElement>).nativeElement;
  private readonly _base = inject(F_CONNECTION) as IHasConnectionFromTo;

  public get connectionForSelectionId(): string {
    return F_CONNECTION_IDENTIFIERS.connectionForSelectionId(
      this._base.fId() + this._base.fOutputId() + this._base.fInputId(),
    );
  }

  public setPath(path: string) {
    this.hostElement.setAttribute('d', `${path}`);
  }
}
