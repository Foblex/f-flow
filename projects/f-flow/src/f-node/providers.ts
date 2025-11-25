import { FNodeDirective } from './f-node.directive';
import { FResizeHandleDirective } from './f-resize-handle';
import { FGroupDirective } from './f-group.directive';
import { FDragHandleDirective } from './f-drag-handle.directive';
import { FRotateHandleDirective } from './f-rotate-handle';
import { FChildrenAreaDirective } from './f-children-area';

export const F_NODE_PROVIDERS = [

  FChildrenAreaDirective,

  FGroupDirective,

  FNodeDirective,

  FDragHandleDirective,

  FResizeHandleDirective,

  FRotateHandleDirective,
];
