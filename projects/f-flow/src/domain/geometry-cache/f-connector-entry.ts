import { IRoundedRect } from '@foblex/2d';
import { FCacheConnectorKey } from './f-cache-connector-key-factory';

export interface IConnectorGeometryRef {
  isConnected: boolean;
  toConnector: unknown[];
}

export class FConnectorEntry {
  constructor(
    public readonly key: FCacheConnectorKey,
    public readonly id: string,
    public readonly kind: string,
    public readonly nodeId: string,
    public elementRef: HTMLElement | SVGElement,
    public connectorRef?: IConnectorGeometryRef,
    public rect?: IRoundedRect | null,
  ) {}
}
