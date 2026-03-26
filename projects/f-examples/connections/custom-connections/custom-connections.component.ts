import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ExampleToolbar } from '@portal-ui';

interface IColorOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'connection-gradients',
  styleUrls: ['./custom-connections.component.scss'],
  templateUrl: './custom-connections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelect, ExampleToolbar],
})
export class ConnectionGradientsComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly colorOptions: readonly IColorOption[] = [
    { label: 'Red', value: '#ef4444' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Sky', value: '#0ea5e9' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Violet', value: '#7c3aed' },
    { label: 'Slate', value: '#334155' },
  ];

  protected readonly startColor = signal(this.colorOptions[0].value);

  protected readonly endColor = signal(this.colorOptions[1].value);

  protected onLoaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
