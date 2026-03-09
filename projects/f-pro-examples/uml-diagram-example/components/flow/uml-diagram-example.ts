import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { PointExtensions } from '@foblex/2d';
import { EFMarkerType, FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { UmlNodeCard, UmlPackageCard } from '../..';
import { UmlLayerClass, UmlRelationClass } from '../../directives';
import { UmlDiagramState } from '../../state';

@Component({
  selector: 'uml-diagram-example',
  templateUrl: './uml-diagram-example.html',
  styleUrls: ['./uml-diagram-example.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UmlDiagramState],
  imports: [
    FFlowModule,
    FZoomDirective,
    UmlNodeCard,
    UmlPackageCard,
    UmlLayerClass,
    UmlRelationClass,
  ],
})
export class UmlDiagramExample {
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly state = inject(UmlDiagramState);
  protected readonly eMarkerType = EFMarkerType;

  protected loaded(): void {
    this.fitToScreen();
  }

  protected fitToScreen(animated: boolean = false): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(70, 70), animated);
  }

  protected resetScaleAndCenter(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
