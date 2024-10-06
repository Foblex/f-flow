import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, } from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FFlowModule,
} from '@foblex/flow';
import { Point } from '@foblex/2d';
import { UML_CHART_GROUPS } from './groups';
import { UML_CHART_NODES } from './nodes';
import { UML_CHART_CONNECTIONS } from './connections';

@Component({
  selector: 'uml-diagram-example',
  templateUrl: './uml-diagram-example.component.html',
  styleUrls: [
    './uml-diagram-example.component.scss',
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
  ]
})
export class UmlDiagramExampleComponent {

  public connections = UML_CHART_CONNECTIONS;

  public nodes = UML_CHART_NODES;

  public groups = UML_CHART_GROUPS;

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  public readonly eMarkerType = EFMarkerType;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public onInitialized(): void {
    this.fCanvasComponent.fitToScreen(new Point(100, 100), false);
  }
}
