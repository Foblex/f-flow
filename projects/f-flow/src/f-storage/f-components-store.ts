import { Injectable } from '@angular/core';
import { FFlowBase } from '../f-flow';
import { FCanvasBase } from '../f-canvas';
import { FBackgroundBase } from '../f-backgroud';
import { FNodeInputBase, FNodeOutletBase, FNodeOutputBase } from '../f-connectors';
import { FDraggableBase } from '../f-draggable';
import { FChannel } from '../reactivity';
import { ITransformModel } from '@foblex/2d';
import { FConnectorRegistry } from './f-connector-registry';
import { FNodeRegistry } from './f-node-registry';
import { FConnectionRegistry } from './f-connection-registry';
import { FConnectionMarkerRegistry } from './f-connection-marker-registry';
import { fInstanceKey, FSingleRegistryBase } from './base';
import { FZoomBase } from '../f-zoom';
import { FSelectionAreaBase } from '../f-selection-area';
import { FMagneticLinesBase } from '../f-magnetic-lines';
import { FMagneticRectsBase } from '../f-magnetic-rects';
import { FMinimapBase } from '../f-minimap';

@Injectable()
export class FComponentsStore {
  public readonly transformChanges$ = new FChannel();

  public readonly connectionsChanges$ = new FChannel();
  private _connectionsRevision = 0;

  public readonly nodesChanges$ = new FChannel();
  private _nodesRevision = 0;

  public readonly progressiveRenderChanges$ = new FChannel();
  private _pendingProgressiveRenderCount = 0;

  public get connectionsRevision(): number {
    return this._connectionsRevision;
  }

  public get nodesRevision(): number {
    return this._nodesRevision;
  }

  public get hasPendingProgressiveRender(): boolean {
    return this._pendingProgressiveRenderCount > 0;
  }

  public get flowHost(): HTMLElement {
    return this.fFlow?.hostElement as HTMLElement;
  }

  public fFlow: FFlowBase | undefined;

  public fCanvas: FCanvasBase | undefined;

  public get transform(): ITransformModel {
    return this.fCanvas?.transform as ITransformModel;
  }

  public readonly nodes = new FNodeRegistry();
  public readonly connections = new FConnectionRegistry();
  public readonly connectionMarkers = new FConnectionMarkerRegistry();

  public readonly outputs = new FConnectorRegistry<FNodeOutputBase>('Output');
  public readonly inputs = new FConnectorRegistry<FNodeInputBase>('Input');
  public readonly outlets = new FConnectorRegistry<FNodeOutletBase>('Outlet');

  public readonly instances = new FSingleRegistryBase();

  public fDraggable: FDraggableBase | undefined;

  public emitNodeChanges(): void {
    this._nodesRevision++;
    this.nodesChanges$.notify();
  }

  public emitConnectionChanges(): void {
    this._connectionsRevision++;
    this.connectionsChanges$.notify();
  }

  public beginProgressiveRender(): void {
    this._pendingProgressiveRenderCount++;
    this.progressiveRenderChanges$.notify();
  }

  public endProgressiveRender(): void {
    if (!this._pendingProgressiveRenderCount) {
      return;
    }

    this._pendingProgressiveRenderCount--;
    this.progressiveRenderChanges$.notify();
  }

  public transformChanged(): void {
    this.transformChanges$.notify();
  }
}

export const INSTANCES = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAGNETIC_LINES: fInstanceKey<FMagneticLinesBase>('magnetic-lines'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAGNETIC_RECTS: fInstanceKey<FMagneticRectsBase>('magnetic-rects'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  ZOOM: fInstanceKey<FZoomBase>('zoom-controls'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  BACKGROUND: fInstanceKey<FBackgroundBase>('background'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  SELECTION_AREA: fInstanceKey<FSelectionAreaBase>('selection-area'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  MINIMAP: fInstanceKey<FMinimapBase>('minimap'),
} as const;
