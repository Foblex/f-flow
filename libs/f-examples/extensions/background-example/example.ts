import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { MatSelectModule } from '@angular/material/select';
import { FlowBackground } from './custom-background-example/custom-background-example';
import { FSelectComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'background-example',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatSelectModule, FlowBackground, FToolbarComponent, FSelectComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly background = signal('custom');

  protected readonly backgroundOptions = ['circle', 'rect', 'custom', 'none'];

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
