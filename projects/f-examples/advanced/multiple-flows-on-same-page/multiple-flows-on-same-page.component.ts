import {
  ChangeDetectionStrategy,
  Component, viewChildren,
} from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule,
} from '@foblex/flow';

@Component({
  selector: 'multiple-flows-on-same-page',
  styleUrls: [ './multiple-flows-on-same-page.component.scss' ],
  templateUrl: './multiple-flows-on-same-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class MultipleFlowsOnSamePageComponent {

  private readonly _flows = viewChildren(FCanvasComponent);

  protected onLoaded(id: string): void {
    this._flows()?.find((x) => x.flowId === id)?.resetScaleAndCenter(false);
  }
}
