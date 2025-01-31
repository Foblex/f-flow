import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FReassignConnectionEvent
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  scale?: number;
  position?: IPoint;
  nodes: INode[];
  connections: IConnection[];
}

const STORE: IState = {
  scale: 1,
  position: { x: 0, y: 0 },
  nodes: [ {
    id: '1',
    position: { x: 0, y: 200 },
    text: 'Node 1',
  }, {
    id: '2',
    position: { x: 200, y: 200 },
    text: 'Node 2',
  } ],
  connections: [ {
    id: '1',
    source: 'f-node-output-0',
    target: 'f-node-input-2',
  } ],
};

@Component({
  selector: 'undo-redo',
  styleUrls: [ './undo-redo.component.scss' ],
  templateUrl: './undo-redo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class UndoRedoComponent implements OnInit {

  private _destroyRef = inject(DestroyRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _undoStates: IState[] = [];
  private _redoStates: IState[] = [];

  protected isRedoEnabled: boolean = false;
  protected isUndoEnabled: boolean = false;

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  protected viewModel: IState = STORE;

  protected readonly eMarkerType = EFMarkerType;

  private _isFirstCanvasChange: boolean = true;

  public ngOnInit(): void {
    this._subscribeToCanvasChange();
  }

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  private _subscribeToCanvasChange(): void {
    this.fCanvas.fCanvasChange.pipe(
      takeUntilDestroyed(this._destroyRef), debounceTime(200)
    ).subscribe((event) => {
      if (this._isFirstCanvasChange) {
        this._setCenteredFlowAsDefault(event);
        return;
      }

      this._stateChanged();

      this.viewModel.position = event.position;
      this.viewModel.scale = event.scale;
    });
  }

  private _setCenteredFlowAsDefault(event: FCanvasChangeEvent): void {
    this._isFirstCanvasChange = false;
    this.viewModel.position = event.position;
    this.viewModel.scale = event.scale;
  }

  protected onConnectionCreated(event: FCreateConnectionEvent): void {
    if (event.fInputId) {
      this._stateChanged();
      this._createConnection(event.fOutputId, event.fInputId);
    }
  }

  protected onConnectionReassigned(event: FReassignConnectionEvent): void {
    if (event.newFInputId) {
      this._stateChanged();
      this._removeConnection(event.fConnectionId);
      this._createConnection(event.fOutputId, event.newFInputId);
    }
  }

  protected onNodeChanged(nodeId: string, position: IPoint): void {
    this._stateChanged();
    const node = this.viewModel.nodes.find((x) => x.id === nodeId);
    if (node) {
      node.position = position;
    }
  }

  private _removeConnection(connectionId: string): void {
    const index = this.viewModel.connections.findIndex((x) => x.id === connectionId);
    this.viewModel.connections.splice(index, 1);
  }

  private _createConnection(source: string, target: string): void {
    this.viewModel.connections.push({ id: generateGuid(), source, target });
  }

  private _stateChanged(): void {
    this._undoStates.push(this._deepClone(this.viewModel));
    this._redoStates = [];
    this._afterStateChanged();
    this._changeDetectorRef.markForCheck();
  }

  protected onUndoClick(): void {
    const currentState = this._deepClone(this.viewModel);
    this.viewModel = this._deepClone(this._undoStates.pop()!);
    this._redoStates.push(currentState);
    this._afterStateChanged();
  }

  protected onRedoClick(): void {
    this._undoStates.push(this._deepClone(this.viewModel));
    this.viewModel = this._deepClone(this._redoStates.pop()!);
    this._afterStateChanged();
  }

  private _afterStateChanged(): void {
    this.isRedoEnabled = this._redoStates.length > 0;
    this.isUndoEnabled = this._undoStates.length > 0;
  }

  private _deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
