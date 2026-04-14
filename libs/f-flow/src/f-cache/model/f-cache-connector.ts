import { IRoundedRect } from '@foblex/2d';
import { FCacheConnectorKey } from './f-cache-connector-key';

export class FCacheConnector {
  constructor(
    public readonly key: FCacheConnectorKey,
    public readonly id: string,
    public readonly kind: string,
    public readonly nodeId: string,
    public element: HTMLElement | SVGElement,
    public rect?: IRoundedRect | null,
  ) {}
}
