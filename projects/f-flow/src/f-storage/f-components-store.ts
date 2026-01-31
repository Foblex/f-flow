import { Injectable } from '@angular/core';
import { FFlowBase } from '../f-flow';
import { FCanvasBase } from '../f-canvas';
import { FBackgroundBase } from '../f-backgroud';
import { FNodeInputBase, FNodeOutletBase, FNodeOutputBase } from '../f-connectors';
import { FDraggableBase } from '../f-draggable';
import { FChannel } from '../reactivity';
import { FLineAlignmentBase } from '../f-line-alignment';
import { FConnectionMarkerStore } from './f-connection-marker-store';
import { ITransformModel } from '@foblex/2d';
import { FConnectorRegistry } from './f-connector-registry';
import { FNodeRegistry } from './f-node-registry';
import { FConnectionRegistry } from './f-connection-registry';

@Injectable()
export class FComponentsStore {
  public readonly transformChanges$ = new FChannel();

  public readonly dataChanges$ = new FChannel();

  public readonly countChanges$ = new FChannel();

  public get flowHost(): HTMLElement {
    return this.fFlow?.hostElement as HTMLElement;
  }

  public fComponents: Record<string, unknown> = {};

  public fFlow: FFlowBase | undefined;

  public fCanvas: FCanvasBase | undefined;

  public fBackground: FBackgroundBase | undefined;

  public get transform(): ITransformModel {
    return this.fCanvas?.transform as ITransformModel;
  }

  public readonly nodes = new FNodeRegistry();
  public readonly connections = new FConnectionRegistry();
  public readonly connectionMarkers = new FConnectionMarkerStore();

  public readonly outputs = new FConnectorRegistry<FNodeOutputBase>('Output');
  public readonly inputs = new FConnectorRegistry<FNodeInputBase>('Input');
  public readonly outlets = new FConnectorRegistry<FNodeOutletBase>('Outlet');

  public fDraggable: FDraggableBase | undefined;

  public fLineAlignment: FLineAlignmentBase | undefined;

  public addComponent<T>(collection: T[], component: T): void {
    collection.push(component);
    this.countChanged();
  }

  public removeComponent<T>(collection: T[], component: T): void {
    const index = collection.indexOf(component);
    if (index > -1) {
      collection.splice(index, 1);
      this.countChanged();
    }
  }

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
