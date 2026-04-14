import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UmlDiagramState } from '../../state';

@Component({
  selector: 'uml-class-detail-panel',
  templateUrl: './class-detail-panel.html',
  styleUrls: ['./class-detail-panel.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class ClassDetailPanel {
  protected readonly state = inject(UmlDiagramState);

  protected readonly selectedClass = this.state.selectedClass;
  protected readonly selectedConnection = this.state.selectedConnection;

  protected readonly classRelations = computed(() => {
    const cls = this.state.selectedClass();
    if (!cls) {
      return [];
    }

    return this.state.connections().filter((c) => c.from === cls.id || c.to === cls.id);
  });

  protected readonly connectionEndpoints = computed(() => {
    const conn = this.state.selectedConnection();
    if (!conn) {
      return null;
    }
    const from = this.state.classes().find((c) => c.id === conn.from);
    const to = this.state.classes().find((c) => c.id === conn.to);

    return { from, to };
  });

  protected onClose(): void {
    this.state.clearSelection();
  }

  protected onClassSelect(classId: string): void {
    this.state.selectClass(classId);
  }

  protected getRelationIcon(kind: string): string {
    const icons: Record<string, string> = {
      composition: 'diamond',
      aggregation: 'change_history',
      association: 'arrow_forward',
      inheritance: 'vertical_align_top',
      dependency: 'arrow_right_alt',
      realization: 'check_circle_outline',
    };

    return icons[kind] ?? 'link';
  }

  protected getLayerLabel(layer: string): string {
    return layer.charAt(0).toUpperCase() + layer.slice(1);
  }
}
