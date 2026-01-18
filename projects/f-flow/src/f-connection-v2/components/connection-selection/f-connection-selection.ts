import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { F_CONNECTION_SELECTION, FConnectionSelectionBase } from './models';
import { createConnectionSelectionDomIdentifier } from '../../utils';
import { F_INJECTABLE_CONNECTION } from '../../models';

@Component({
  selector: 'path[fConnectionSelection]',
  template: '',
  styleUrls: ['./f-connection-selection.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-selection',
    '[attr.id]': 'connectionForSelectionId',
  },
  providers: [
    {
      provide: F_CONNECTION_SELECTION,
      useExisting: FConnectionSelection,
    },
  ],
})
export class FConnectionSelection extends FConnectionSelectionBase {
  private readonly _connection = inject(F_INJECTABLE_CONNECTION);

  public get connectionForSelectionId(): string {
    return createConnectionSelectionDomIdentifier(
      this._connection.fId(),
      this._connection.fOutputId(),
      this._connection.fInputId(),
    );
  }

  public override setPath(path: string) {
    this.hostElement.setAttribute('d', `${path}`);
  }
}
