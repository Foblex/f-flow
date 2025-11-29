import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FlowBackground } from './custom-background-example/custom-background-example';

@Component({
  selector: 'background-example',
  styleUrls: ['./background-example.component.scss'],
  templateUrl: './background-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatFormField, MatLabel, MatOption, MatSelectModule, FlowBackground],
})
export class BackgroundExampleComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly background = signal('custom');

  protected readonly backgroundOptions = ['circle', 'rect', 'custom', 'none'];

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
