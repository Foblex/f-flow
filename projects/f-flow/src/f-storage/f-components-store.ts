import { Injectable } from '@angular/core';
import { ITransformModel } from '@foblex/2d';
import { FConnectionBase, FMarkerBase } from '../f-connection';
import { FFlowBase } from '../f-flow';
import { FCanvasBase } from '../f-canvas';
import { FBackgroundBase } from '../f-backgroud';
import { FNodeBase } from '../f-node';
import { FConnectorBase } from '../f-connectors';
import { FDraggableBase } from '../f-draggable';
import { FChannel } from '../reactivity';

@Injectable()
export class FComponentsStore {

  public readonly transformChanges$ = new FChannel();

  public readonly dataChanges$ = new FChannel();

  public readonly countChanges$ = new FChannel();

  public get flowHost(): HTMLElement {
    return this.fFlow?.hostElement!;
  }

  public get transform(): ITransformModel {
    return this.fCanvas?.transform!;
  }

  public fFlow: FFlowBase | undefined;

  public fCanvas: FCanvasBase | undefined;

  public fBackground: FBackgroundBase | undefined;

  public fNodes: FNodeBase[] = [];

  public fConnections: FConnectionBase[] = [];

  public fTempConnection: FConnectionBase | undefined;

  public fSnapConnection: FConnectionBase | undefined;

  public fMarkers: FMarkerBase[] = [];

  public fOutputs: FConnectorBase[] = [];

  public fInputs: FConnectorBase[] = [];

  public fOutlets: FConnectorBase[] = [];

  public fDraggable: FDraggableBase | undefined;

  public findNode(element: HTMLElement | SVGElement): FNodeBase | undefined {
    return this.fNodes.find(n => n.isContains(element));
  }

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
