import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {
  EFResizeHandleType,
  FCanvasComponent, FCreateNodeEvent, FDropToGroupEvent,
  FFlowModule,
} from '@foblex/flow';
import {FCheckboxComponent} from "@foblex/m-render";

interface INode {
  id: string;
  position: { x: number; y: number };
  parentId?: string;
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

  protected readonly includePaddings = signal<boolean>(true);
  protected readonly autoSizeToFitChildren = signal<boolean>(true);
  protected readonly autoExpandOnChildHit = signal<boolean>(true);

  protected readonly eResizeHandleType = EFResizeHandleType;

  protected readonly groups = signal<INode[]>([{
    id: 'g1', position: {x: 0, y: 0}
  }, {
    id: 'g2', position: {x: 0, y: 250}
  }]);

  protected readonly nodes = signal<INode[]>([{
    id: 'n1', position: {x: 250, y: 0}
  }, {
    id: 'n2', position: {x: 250, y: 250}
  }]);

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
        if(node) {
          node!.parentId = event.fTargetNode;
        }
      }
    });
    this.groups.set([...groups]);
    this.nodes.set([...nodes]);
  }

  protected onCreateNode(event: FCreateNodeEvent): void {
    const newNode: INode = {
      id: 'n' + (this.nodes().length + 1),
      position: event.rect,
      parentId: event.fTargetNode,
    };

    this.nodes.set([...this.nodes(), newNode]);
  }
}
