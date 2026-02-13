import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { ElementRef, Injector, signal } from '@angular/core';
import { FComponentsStore } from '../f-storage';
import { FConnectionBase, FDraggableDataContext, FNodeBase } from '@foblex/flow';

export class MockElementRef extends ElementRef<HTMLElement> {
  constructor() {
    super(document.createElement('div'));
  }
}

export function setupTestModule(providers: any[] = [], declarations: any[] = []): void {
  TestBed.configureTestingModule({
    declarations: [
      ...declarations,
    ],
    providers: [
      FMediator,
      FComponentsStore,
      FDraggableDataContext,
      { provide: ElementRef, useClass: MockElementRef },
      Injector,
      ...providers,
    ],
  });
}

export function mockNode(data: Partial<FNodeBase>): FNodeBase {
  return {
    fId: data.fId || signal(''),
    fParentId: data.fParentId ?? signal<string | null>(null),
    hostElement: data.hostElement || new MockElementRef().nativeElement,
    ...data,
  } as FNodeBase;
}

export function mockConnection(data: Partial<FConnectionBase>): FConnectionBase {
  return {
    fId: data.fId || signal(''),
    ...data,
  } as FConnectionBase;
}
