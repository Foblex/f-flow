import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {
  FCanvasComponent, FDropToGroupEvent,
  FFlowModule,
} from '@foblex/flow';
import {FCheckboxComponent} from "@foblex/m-render";

interface INode {
  id: string;
  position: { x: number; y: number };
  parentId: string | null;
}

@Component({
  selector: 'drag-to-group',
  styleUrls: ['./drag-to-group.component.scss'],
  templateUrl: './drag-to-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
  ]
})
export class DragToGroupComponent {

  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly includePaddings = signal<boolean>(false);

  protected readonly groups = signal<INode[]>([{
    id: 'g1', position: {x: 0, y: 0}, parentId: null,
  }, {
    id: 'g2', position: {x: 0, y: 250}, parentId: null,
  }]);

  protected readonly nodes = signal<INode[]>([{
    id: 'n1', position: {x: 250, y: 0}, parentId: null,
  }, {
    id: 'n2', position: {x: 250, y: 250}, parentId: null,
  }]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected onDropToGroup(event: FDropToGroupEvent): void {
    if (!event.fTargetNode) {
      return
    }

    const groups = this.groups();
    const nodes = this.nodes();

    event.fNodes.forEach((id) => {
      const group = groups.find(x => x.id === id);
      if (group) {
        group.parentId = event.fTargetNode;
      } else {
        const node = nodes.find(x => x.id === id);
        node!.parentId = event.fTargetNode;
      }
    });
    this.groups.set([...groups]);
    this.nodes.set([...nodes]);
  }

  protected changePaddings(): void {
    this.includePaddings.set(!this.includePaddings());
  }
}
