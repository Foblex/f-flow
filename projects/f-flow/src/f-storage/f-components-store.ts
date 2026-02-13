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
import { FLineAlignmentBase } from '../f-line-alignment';
import { FZoomBase } from '../f-zoom';

@Injectable()
export class FComponentsStore {
  public readonly transformChanges$ = new FChannel();

  public readonly dataChanges$ = new FChannel();

  public readonly countChanges$ = new FChannel();

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

  public countChanged(): void {
    this.countChanges$.notify();
  }

  public dataChanged(): void {
    this.dataChanges$.notify();
  }

  public transformChanged(): void {
    this.transformChanges$.notify();
  }
}

export const INSTANCES = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAGNETIC_LINES: fInstanceKey<FLineAlignmentBase>('magnetic-lines'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  ZOOM: fInstanceKey<FZoomBase>('zoom-controls'),

  // eslint-disable-next-line @typescript-eslint/naming-convention
  BACKGROUND: fInstanceKey<FBackgroundBase>('background'),


} as const;
