import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FZoomDirective,
} from '@foblex/flow';
import { UmlDiagramState } from '../../state';
import { UmlController } from '../../controllers';
import { UmlLayerClass, UmlRelationClass } from '../../directives';
import { ClassNode } from '../class-node/class-node';
import { PackageGroup } from '../package-group/package-group';
import { DiagramLegend } from '../diagram-legend/diagram-legend';
import { DiagramToolbar } from '../diagram-toolbar/diagram-toolbar';
import { ClassDetailPanel } from '../class-detail-panel/class-detail-panel';

@Component({
  selector: 'uml-flow',
  templateUrl: './uml-flow.html',
  styleUrls: ['./uml-flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UmlDiagramState, UmlController],
  imports: [
    FFlowModule,
    FZoomDirective,
    UmlLayerClass,
    UmlRelationClass,
    ClassNode,
    PackageGroup,
    DiagramLegend,
    DiagramToolbar,
    ClassDetailPanel,
  ],
})
export class UmlFlow {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);

  protected readonly state = inject(UmlDiagramState);
  protected readonly controller = inject(UmlController);
  protected readonly eMarkerType = EFMarkerType;

  protected readonly hasHighlight = this.state.hasHighlight;
  protected readonly highlightedClassIds = this.state.highlightedClassIds;
  protected readonly highlightedConnectionIds = this.state.highlightedConnectionIds;
  protected readonly selectedClassId = this.state.selectedClassId;

  protected readonly hasDetailPanel = computed(
    () => this.state.selectedClass() !== null || this.state.selectedConnection() !== null,
  );

  protected readonly connectionCounts = this.state.classConnectionCounts;

  protected flowRendered(): void {
    const flow = this._flow();
    const canvas = this._canvas();
    const zoom = this._zoom();

    if (flow && canvas && zoom) {
      this.controller.initialize(flow, canvas, zoom);
    }

    this.controller.fitToScreen();
  }

  protected onClassClick(classId: string): void {
    this.state.selectClass(classId);
  }

  protected onCanvasClick(): void {
    this.state.clearSelection();
  }

  protected isClassHighlighted(classId: string): boolean {
    return this.highlightedClassIds().has(classId);
  }

  protected isClassDimmed(classId: string): boolean {
    return this.hasHighlight() && !this.highlightedClassIds().has(classId);
  }

  protected isClassSelected(classId: string): boolean {
    return this.selectedClassId() === classId;
  }

  protected isConnectionHighlighted(connectionId: string): boolean {
    return this.highlightedConnectionIds().has(connectionId);
  }

  protected isConnectionDimmed(connectionId: string): boolean {
    return this.hasHighlight() && !this.highlightedConnectionIds().has(connectionId);
  }

  protected getConnectionCount(classId: string): number {
    return this.connectionCounts().get(classId) ?? 0;
  }
}
