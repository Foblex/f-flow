import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../f-storage';
import { FConnectionBase } from '../f-connection';

@Injectable()
export class GetConnectionHandler implements IHandler<HTMLElement | SVGElement, FConnectionBase | undefined> {

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
      private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this.fConnections.find(c => c.isContains(element) || c.fConnectionCenter?.nativeElement?.contains(element));
  }
}
