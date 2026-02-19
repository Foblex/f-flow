import { EFResizeHandleType } from '../../../f-node';

export const RESIZE_DIRECTIONS = {
  [EFResizeHandleType.LEFT]: { x: -1, y: 0 },

  [EFResizeHandleType.LEFT_TOP]: { x: -1, y: -1 },

  [EFResizeHandleType.TOP]: { x: 0, y: -1 },

  [EFResizeHandleType.RIGHT_TOP]: { x: 1, y: -1 },

  [EFResizeHandleType.RIGHT]: { x: 1, y: 0 },

  [EFResizeHandleType.RIGHT_BOTTOM]: { x: 1, y: 1 },

  [EFResizeHandleType.BOTTOM]: { x: 0, y: 1 },

  [EFResizeHandleType.LEFT_BOTTOM]: { x: -1, y: 1 },
};
