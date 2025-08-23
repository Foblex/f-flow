import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';
import {FCheckboxComponent} from "@foblex/m-render";

@Component({
  selector: 'grouping',
  styleUrls: [ './grouping.component.scss' ],
  templateUrl: './grouping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
  ]
})
export class GroupingComponent {

  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly includePaddings = signal<boolean>(true);
  protected readonly autoSizeToFitChildren = signal<boolean>(true);
  protected readonly autoExpandOnChildHit = signal<boolean>(true);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected changePaddings(): void {
    this.includePaddings.set(!this.includePaddings());
  }

  protected changeSizeToFitChildren(): void {
    this.autoSizeToFitChildren.set(!this.autoSizeToFitChildren());
  }

  protected changeExpandOnChildHit(): void {
    this.autoExpandOnChildHit.set(!this.autoExpandOnChildHit());
  }
}
