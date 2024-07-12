import { TestBed } from '@angular/core/testing';
import { FFlowMediator } from '../infrastructure';
import { ElementRef, Injector } from '@angular/core';
import { FComponentsStore } from '../f-storage';
import { FDraggableDataContext } from '../f-draggable';

export class MockElementRef extends ElementRef<HTMLElement> {
  constructor() {
    super(document.createElement('div'));
  }
}

export function setupTestModule(providers: any[] = [], declarations: any[] = []): void {
  TestBed.configureTestingModule({
    declarations: [
      ...declarations
    ],
    providers: [
      FFlowMediator,
      FComponentsStore,
      FDraggableDataContext,
      { provide: ElementRef, useClass: MockElementRef },
      Injector,
      ...providers
    ]
  }).compileComponents();
}


