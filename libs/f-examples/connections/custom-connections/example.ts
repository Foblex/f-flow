import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { ExampleSelect, ExampleToolbar } from '@foblex/portal-ui';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'connection-gradients',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, ExampleToolbar, ExampleSelect],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly colorOptions: KeyValue<string, string>[] = [
    { value: 'Red', key: '#ef4444' },
    { value: 'Green', key: '#22c55e' },
    { value: 'Sky', key: '#0ea5e9' },
    { value: 'Amber', key: '#f59e0b' },
    { value: 'Rose', key: '#e11d48' },
    { value: 'Violet', key: '#7c3aed' },
    { value: 'Slate', key: '#334155' },
  ];

  protected readonly startColor = signal(this.colorOptions[0].key);

  protected readonly endColor = signal(this.colorOptions[1].key);

  protected onLoaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
