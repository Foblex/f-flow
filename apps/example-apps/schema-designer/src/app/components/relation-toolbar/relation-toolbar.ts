import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ERelationType, IConnection } from '../../domain';
import { FlowController } from '../../controllers/flow-controller';
import { EditorStore } from '../../store';

@Component({
  selector: 'div[relation-toolbar]',
  templateUrl: './relation-toolbar.html',
  styleUrl: './relation-toolbar.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip],
})
export class RelationToolbar {
  private readonly _store = inject(EditorStore);
  private readonly _controller = inject(FlowController);

  public readonly connection = input.required<IConnection>();

  protected readonly eRelationType = ERelationType;

  protected changeType(event: MouseEvent, type: ERelationType): void {
    this._stopEvent(event);
    this._store.changeConnectionType(this.connection().id, type);
    this._resetSelection();
  }

  protected remove(event: MouseEvent): void {
    this._stopEvent(event);
    this._store.removeConnection(this.connection().id);
  }

  private _resetSelection(): void {
    this._store.clearSelection();
    this._controller.clearSelection();
  }

  private _stopEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
