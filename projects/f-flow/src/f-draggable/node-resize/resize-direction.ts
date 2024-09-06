import { EFResizeHandleType } from '../../f-node';

export const RESIZE_DIRECTIONS = {

  [ EFResizeHandleType.LEFT_TOP ]: { x: -1, y: -1 },

  [ EFResizeHandleType.RIGHT_TOP ]: { x: 1, y: -1 },

  [ EFResizeHandleType.RIGHT_BOTTOM ]: { x: 1, y: 1 },

  [ EFResizeHandleType.LEFT_BOTTOM ]: { x: -1, y: 1 },
};
