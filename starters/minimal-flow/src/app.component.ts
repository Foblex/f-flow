import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

interface Connection {
  id: string;
  source: string;
  target: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FFlowModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <f-flow fDraggable (fCreateConnection)="createConnection($event)">
      <f-canvas fZoom>
        <f-connection-for-create />

        @for (connection of connections(); track connection.id) {
          <f-connection
            [fConnectionId]="connection.id"
            [fSourceId]="connection.source"
            [fTargetId]="connection.target"
          >
            <f-connection-marker-arrow />
          </f-connection>
        }

        <div fNode fDragHandle [fNodePosition]="{ x: 60, y: 80 }">
          Drag me
          <div fConnector fConnectorType="source" fConnectorId="a-out" class="connector right"></div>
        </div>

        <div fNode fDragHandle [fNodePosition]="{ x: 340, y: 200 }">
          Connect to me
          <div fConnector fConnectorType="target" fConnectorId="b-in" class="connector left"></div>
        </div>
      </f-canvas>
    </f-flow>
  `,
  styles: `
    .f-node {
      padding: 16px 24px;
    }

    .connector {
      position: absolute;
      top: 50%;
      width: 14px;
      height: 14px;
      transform: translateY(-50%);
      border-radius: 50%;
      cursor: pointer;
    }

    .connector.left {
      left: -7px;
    }

    .connector.right {
      right: -7px;
    }
  `,
})
export class AppComponent {
  protected readonly connections = signal<Connection[]>([
    { id: 'c1', source: 'a-out', target: 'b-in' },
  ]);

  protected createConnection(event: FCreateConnectionEvent): void {
    const targetId = event.targetId;
    if (!targetId) {
      return;
    }
    this.connections.update((list) => [
      ...list,
      { id: crypto.randomUUID(), source: event.sourceId, target: targetId },
    ]);
  }
}
