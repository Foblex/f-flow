import { FNodeDirective } from './f-node.directive';
import { FDragHandleDirective } from './f-drag-handle';
import { FResizeHandleDirective } from './f-resize-handle';
import { FGroupDirective } from './f-group.directive';

export const F_NODE_PROVIDERS = [

  FGroupDirective,

  FNodeDirective,

  FDragHandleDirective,

  FResizeHandleDirective,
];
