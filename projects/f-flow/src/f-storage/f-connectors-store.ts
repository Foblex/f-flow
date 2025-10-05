import { Injectable } from '@angular/core';
import { EFConnectableSide } from '../f-connectors';

@Injectable()
export class FConnectorsStore {
  private readonly _connectors: Record<string, Record<string, EFConnectableSide>> = {};
}
