import { Injectable } from '@angular/core';
import { FCacheConnector } from './f-cache-connector';
import { FCacheConnectorKey } from './f-cache-connector-key';
import { FCacheNode } from './f-cache-node';

@Injectable()
export class FCache {
  public readonly nodeEntries = new Map<string, FCacheNode>();
  public readonly nodeIdByElement = new WeakMap<Element, string>();

  public readonly connectorEntries = new Map<FCacheConnectorKey, FCacheConnector>();
  public readonly connectorKeysByNodeId = new Map<string, Set<FCacheConnectorKey>>();
  public readonly connectorKeyByElement = new WeakMap<Element, FCacheConnectorKey>();
}
