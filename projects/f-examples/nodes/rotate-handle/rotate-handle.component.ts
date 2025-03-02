import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';

@Component({
  selector: 'rotate-handle',
  styleUrls: [ './rotate-handle.component.scss' ],
  templateUrl: './rotate-handle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class RotateHandleComponent {

  protected readonly eMarkerType = EFMarkerType;

  private _fCanvas = viewChild.required(FCanvasComponent);

  protected nodes = [ {
    id: '1',
    position: { x: 0, y: 200 },
    rotate: 45,
    text: 'Node 1',
  }, {
    id: '2',
    position: { x: 400, y: 200 },
    rotate: 0,
    text: 'Node 2',
  } ];

  protected connections = [ {
    id: '1',
    source: '1-output-0',
    target: '2-input-1',
  } ];

  protected onLoaded(): void {
    this._fCanvas().resetScaleAndCenter(false);
  }

  protected onRotateChanged(rotate: number): void {
    ///process data
  }
}
