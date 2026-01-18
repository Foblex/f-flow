import { Injectable } from '@angular/core';
import { EFConnectableSide } from '../f-connection-v2';

@Injectable()
export class FConnectorsStore {
  private readonly _connectors: Record<string, Record<string, EFConnectableSide>> = {};
}
