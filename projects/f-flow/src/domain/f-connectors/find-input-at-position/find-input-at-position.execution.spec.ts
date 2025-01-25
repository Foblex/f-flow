// import { TestBed } from '@angular/core/testing';
// import { FMediator } from '@foblex/mediator';
// import { RectExtensions, Point, RoundedRect } from '@foblex/2d';
// import { BrowserService } from '@foblex/platform';
// import { FComponentsStore } from '../../../f-storage';
// import { FDraggableDataContext } from '../../../f-draggable';
// import { FindInputAtPositionExecution } from './find-input-at-position.execution';
// import { FindInputAtPositionRequest } from './find-input-at-position.request';
// import { FConnectorBase } from '../../../f-connectors';
// import { FNodeBase } from '../../../f-node';
// import { FSnapConnectionComponent } from '../../../f-connection';
// import { setupTestModule } from '../../test-setup';
// import { CalculateClosestInputExecution, FFlowBase } from '@foblex/flow';
//
// function fakeNode(fId: string, x: number, y: number, fConnectOnNode: boolean = false): FNodeBase {
//   return {
//     fId,
//     position: { x, y },
//     isContains: (element: HTMLElement | SVGElement) => {
//       return element.id === fId;
//     },
//     fConnectOnNode,
//   } as FNodeBase;
// }
//
// describe('FindInputAtPositionExecution', () => {
//   let fComponentsStore: FComponentsStore;
//   let fMediator: FMediator;
//   let fBrowser: BrowserService;
//   let fDraggableDataContext: FDraggableDataContext;
//
//   beforeEach(() => {
//     setupTestModule([ FindInputAtPositionExecution, CalculateClosestInputExecution ]);
//     fComponentsStore = TestBed.inject(FComponentsStore) as jasmine.SpyObj<FComponentsStore>;
//     fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
//     fBrowser = TestBed.inject(BrowserService) as jasmine.SpyObj<BrowserService>;
//     fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
//
//     fComponentsStore.fNodes = [
//       fakeNode('node-1', 200, 200),
//       fakeNode('node-2', 300, 300),
//       fakeNode('node-3', 400, 400),
//     ];
//
//     fBrowser.document.elementsFromPoint = (x: number, y: number) => {
//       if (x > 200 && x < 250 && y > 200 && y < 250) {
//         return [ { id: 'node-1' } as HTMLElement ];
//       } else if (x > 300 && x < 350 && y > 300 && y < 350) {
//         return [ { id: 'node-2' } as HTMLElement ];
//       } else if (x > 400 && x < 450 && y > 400 && y < 450) {
//         return [ { id: 'node-3' } as HTMLElement ];
//       }
//       return [];
//     }
//   });
//
//   // it('should return undefined when no inputs are found at position', () => {
//   //   fComponentsStore.fNodes = [];
//   //   fBrowser.document.elementsFromPoint = jasmine.createSpy().and.returnValue([]);
//   //
//   //   const result = fMediator.execute(
//   //     new FindInputAtPositionRequest({ x: 50, y: 50 }, new RoundedRect(), [])
//   //   );
//   //
//   //   expect(result).toBeUndefined();
//   // });
//   //
//   // it('should return the closest input if it is within the snap threshold', () => {
//   //   fComponentsStore.fSnapConnection = { fSnapThreshold: 100 } as FSnapConnectionComponent;
//   //
//
//   //
//   //   fComponentsStore.fInputs = [
//   //     { fId: 'input-1', fNodeId: 'node-1' } as FConnectorBase,
//   //     { fId: 'input-2', fNodeId: 'node-2' } as FConnectorBase,
//   //     { fId: 'input-3', fNodeId: 'node-3' } as FConnectorBase,
//   //   ];
//   //
//   //   fComponentsStore.fFlow = {
//   //     hostElement: {
//   //       getBoundingClientRect: () => {
//   //         return { x: 0, y: 0, width: 1000, height: 1000 };
//   //       },
//   //     } as HTMLElement,
//   //   } as FFlowBase;
//   //
//   //   let result = fMediator.execute<FConnectorBase | undefined>(
//   //     new FindInputAtPositionRequest(
//   //       { x: 50, y: 50 },
//   //       new RoundedRect(200, 200, 0, 0),
//   //       [
//   //         { fConnector: { fId: 'input-1' } as FConnectorBase, fRect: new RoundedRect(200, 200, 10, 10) },
//   //         { fConnector: { fId: 'input-2' } as FConnectorBase, fRect: new RoundedRect(300, 300, 10, 10) },
//   //         { fConnector: { fId: 'input-3' } as FConnectorBase, fRect: new RoundedRect(400, 400, 10, 10) },
//   //       ]
//   //     )
//   //   );
//   //
//   //   expect(result?.fId).toBe('input-1');
//   //
//   //   result = fMediator.execute<FConnectorBase | undefined>(
//   //     new FindInputAtPositionRequest(
//   //       { x: 50, y: 50 },
//   //       new RoundedRect(210, 210, 0, 0),
//   //       [
//   //         { fConnector: { fId: 'input-1' } as FConnectorBase, fRect: new RoundedRect(200, 200, 10, 10) },
//   //         { fConnector: { fId: 'input-2' } as FConnectorBase, fRect: new RoundedRect(300, 300, 10, 10) },
//   //         { fConnector: { fId: 'input-3' } as FConnectorBase, fRect: new RoundedRect(400, 400, 10, 10) },
//   //       ]
//   //     )
//   //   );
//   //
//   //   expect(result?.fId).toBe('input-2');
//   //
//   //   result = fMediator.execute<FConnectorBase | undefined>(
//   //     new FindInputAtPositionRequest(
//   //       { x: 50, y: 50 },
//   //       new RoundedRect(210, 210, 0, 0),
//   //       [
//   //         { fConnector: { fId: 'input-1' } as FConnectorBase, fRect: new RoundedRect(200, 200, 10, 10) },
//   //         { fConnector: { fId: 'input-3' } as FConnectorBase, fRect: new RoundedRect(400, 400, 10, 10) },
//   //       ]
//   //     )
//   //   );
//   //
//   //   expect(result?.fId).toBe('input-1');
//   // });
//   //
//   // it('should ignore closest input if it exceeds the snap threshold', () => {
//   //   const mockSnapConnection = { fSnapThreshold: 10 } as FSnapConnectionComponent;
//   //   fComponentsStore.fSnapConnection = mockSnapConnection;
//   //   fMediator.send.and.returnValue({
//   //     fConnector: { fId: 'far-input' } as FConnectorBase,
//   //     distance: 15,
//   //   });
//   //
//   //   const result = execution.handle(
//   //     new FindInputAtPositionRequest({ x: 50, y: 50 }, [
//   //       {
//   //         fConnector: { fId: 'far-input' } as FConnectorBase,
//   //         fRect: RoundedRect.fromRect({ x: 60, y: 60, width: 10, height: 10 }),
//   //       },
//   //     ], RoundedRect.fromRect({ x: 0, y: 0, width: 0, height: 0 }))
//   //   );
//   //
//   //   expect(result).toBeUndefined();
//   // });
//   //
//   it('should return the first connectable input of a node at position', () => {
//     //fComponentsStore.fSnapConnection = { fSnapThreshold: 100 } as FSnapConnectionComponent;
//
//     // fBrowser.document.elementsFromPoint = jasmine.createSpy().and.returnValue([
//     //   { id: 'node-3' } as HTMLElement, { id: 'node-2' } as HTMLElement, { id: 'node-1' } as HTMLElement
//     // ]);
//
//     const isContains = (element: HTMLElement | SVGElement) => {
//       return element.id === 'node-3';
//     };
//
//     // fComponentsStore.fNodes = [
//     //   fakeNode('node-1', 200, 200),
//     //   fakeNode('node-2', 300, 300),
//     //   fakeNode('node-3', 400, 400, isContains, true),
//     // ];
//
//     fComponentsStore.fInputs = [
//       { fId: 'input-1', fNodeId: 'node-1' } as FConnectorBase,
//       { fId: 'input-2', fNodeId: 'node-2' } as FConnectorBase,
//       { fId: 'input-3', fNodeId: 'node-3' } as FConnectorBase,
//     ];
//
//     fComponentsStore.fFlow = {
//       hostElement: {
//         getBoundingClientRect: () => {
//           return { x: 0, y: 0, width: 1000, height: 1000 };
//         },
//       } as HTMLElement,
//     } as FFlowBase;
//
//     let result = fMediator.execute<FConnectorBase | undefined>(
//       new FindInputAtPositionRequest(
//         { x: 400, y: 400 },
//         new RoundedRect(200, 200, 0, 0),
//         [
//           { fConnector: { fId: 'input-1' } as FConnectorBase, fRect: new RoundedRect(200, 200, 10, 10) },
//           { fConnector: { fId: 'input-2' } as FConnectorBase, fRect: new RoundedRect(300, 300, 10, 10) },
//           { fConnector: { fId: 'input-3' } as FConnectorBase, fRect: new RoundedRect(400, 400, 10, 10) },
//         ]
//       )
//     );
//
//     expect(result?.fId).toBe('input-1');
//   });
// });
