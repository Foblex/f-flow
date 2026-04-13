import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UmlDiagramState } from '../../state';
import { TUmlLayer, TUmlRelationKind } from '../../domain';

@Component({
  selector: 'uml-diagram-legend',
  templateUrl: './diagram-legend.html',
  styleUrls: ['./diagram-legend.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class DiagramLegend {
  protected readonly state = inject(UmlDiagramState);

  protected isLayerVisible(layer: TUmlLayer): boolean {
    return this.state.visibleLayers().has(layer);
  }

  protected onToggleLayer(layer: TUmlLayer): void {
    this.state.toggleLayer(layer);
  }

  protected isRelationVisible(kind: TUmlRelationKind): boolean {
    return this.state.visibleRelations().has(kind);
  }

  protected onToggleRelation(kind: TUmlRelationKind): void {
    this.state.toggleRelation(kind);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.setSearchQuery(value);
  }
}
