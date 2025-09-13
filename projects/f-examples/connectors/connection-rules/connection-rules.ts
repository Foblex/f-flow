import { ChangeDetectionStrategy, Component, model, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'connection-rules',
  styleUrls: ['./connection-rules.scss'],
  templateUrl: './connection-rules.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelect],
})
export class ConnectionRules {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<{ from: string; to: string }[]>([]);

  protected readonly categories = signal(['A', 'B', 'C']);
  protected readonly category = model('A');

  protected readonly inputs = signal(['input1', 'input2', 'input3']);
  protected readonly input = model('input1');

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.connections().push({ from: event.fOutputId, to: event.fInputId });
  }

  protected deleteConnections(): void {
    this.connections.set([]);
  }
}
