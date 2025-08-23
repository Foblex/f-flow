import {
  ChangeDetectionStrategy,
  Component, computed, effect, inject, Injectable, Injector,
  OnInit, signal, untracked,
  viewChild,
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent, FFlowComponent,
  FFlowModule, FMoveNodesEvent,
  FReassignConnectionEvent, FSelectionChangeEvent
} from '@foblex/flow';
import {IPoint} from '@foblex/2d';
import {Mutator} from "@foblex/mutator";
import {generateGuid} from "@foblex/utils";

interface INode {
  id: string;
  position: IPoint;
  text: string;
}

interface IConnection {
  id: string;
  source: string;
  target: string;
}

interface IState {
  nodes: Record<string, INode>;
  connections: Record<string, IConnection>;
  selection?: {
    nodes: string[];
    connections: string[];
  },
  transform?: {
    position: IPoint;
    scale: number;
  }
}

@Injectable()
class FlowState extends Mutator<IState> {
}

const DEFAULT_STATE: IState = {
  nodes: {
    ['node1']: {
      id: 'node1',
      position: {x: 0, y: 200},
      text: 'Node 1',
    },
    ['node2']: {
      id: 'node2',
      position: {x: 200, y: 200},
      text: 'Node 2',
    }
  },
  connections: {
    ['connection1']: {
      id: 'connection1',
      source: 'node1-output-0',
      target: 'node2-input-1',
    }
  },
  transform: {
    position: {x: 0, y: 0},
    scale: 1,
  }
};

@Component({
  selector: 'undo-redo-v2',
  styleUrls: ['./undo-redo-v2.scss'],
  templateUrl: './undo-redo-v2.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [FlowState],
  imports: [
    FFlowModule
  ]
})
export class UndoRedoV2 implements OnInit {
  protected readonly state = inject(FlowState);
  private readonly _injector = inject(Injector);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;

  private _isChangeAfterLoadedResetAndCenter = true;

  // Debounce time for canvas change events. It helps to prevent excessive updates when zooming;
  protected fCanvasChangeEventDebounce = 200; // milliseconds

  protected readonly viewModel = signal<IState | undefined>(undefined);

  protected readonly nodes = computed(() => {
    return Object.values(this.viewModel()?.nodes || {});
  });

  protected readonly connections = computed(() => {
    return Object.values(this.viewModel()?.connections || {});
  });

  public ngOnInit(): void {
    this.state.initialize(DEFAULT_STATE);
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    effect(() => {
      this.state.changes();
      untracked(() => this._applyChanges());
    }, {injector: this._injector});
  }

  private _applyChanges(): void {
    this.viewModel.set(this.state.getSnapshot());
    if (!this.viewModel()) {
      return;
    }
    this._reCenterCanvasIfUndedToFirstStep();
    this._applySelectionChanges(this.viewModel()!);
  }

  private _reCenterCanvasIfUndedToFirstStep(): void {
    if (!this.state.canUndo() && !this._isChangeAfterLoadedResetAndCenter) {
      this.editorLoaded();
    }
  }

  private _applySelectionChanges({selection}: IState): void {
    this._flow()?.select(selection?.nodes || [], selection?.connections || [], false);
  }

  protected editorLoaded(): void {
    this._isChangeAfterLoadedResetAndCenter = true;
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected changeCanvasTransform(event: FCanvasChangeEvent): void {
    this._ifCanvasChangedFromInitialReCenterUpdateInitialState(event);
  }

  private _ifCanvasChangedFromInitialReCenterUpdateInitialState(event: FCanvasChangeEvent): void {
    if (this._isChangeAfterLoadedResetAndCenter) {
      this._isChangeAfterLoadedResetAndCenter = false;
      this.state.patchBase({transform: {...event}});
      return;
    }
    this.state.update({
      transform: createTransformObject(event)
    });
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (event.fInputId) {
      const connection = createConnectionObject(event);
      this.state.create({
        connections: {
          [connection.id]: connection
        }
      });
    }
  }

  protected reassignConnection(event: FReassignConnectionEvent): void {
    if (event.newTargetId) {
      this.state.update({
        connections: {
          [event.connectionId]: {target: event.newTargetId}
        }
      });
    }
  }

  protected moveNodes(event: FMoveNodesEvent): void {
    this.state.update({
      nodes: createMoveNodesChangeObject(event.fNodes)
    });
  }

  protected changeSelection(event: FSelectionChangeEvent): void {
    this.state.update({
      selection: {
        nodes: [...event.fNodeIds],
        connections: [...event.fConnectionIds],
      }
    });
  }
}

function createTransformObject({position, scale}: FCanvasChangeEvent) {
  return {position, scale};
}

function createConnectionObject({fOutputId, fInputId}: FCreateConnectionEvent) {
  return {
    id: generateGuid(), source: fOutputId, target: fInputId!
  }
}

function createMoveNodesChangeObject(nodes: { id: string; position: IPoint; }[]) {
  return Object.fromEntries(
    nodes.map(({id, position}) => [id, {position}])
  );
}
