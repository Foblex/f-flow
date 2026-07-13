import { IPoint, ISize } from '@foblex/2d';

/**
 * The framework fields the state plugin needs on a node — they map 1:1 onto
 * `fNode` inputs. Add your own fields by extending it; the store carries them
 * through untouched.
 *
 * ```typescript
 * interface MyNode extends IFStateNode {
 *   text: string;
 * }
 * ```
 */
export interface IFStateNode {
  id: string;
  position: IPoint;
  size?: ISize;
  rotate?: number;
  parentId?: string | null;
}

/**
 * The framework fields for a group — a container rendered with `fGroup`.
 * Extend it to attach your own fields.
 */
export interface IFStateGroup {
  id: string;
  position: IPoint;
  size?: ISize;
  rotate?: number;
  parentId?: string | null;
}

/**
 * The framework fields for a connection. `sourceId`/`targetId` are CONNECTOR
 * ids — the same values `fSourceId`/`fTargetId` bind to. Extend it to attach
 * your own fields.
 */
export interface IFStateConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

/**
 * The canvas viewport transform — its pan position and zoom scale. Maps onto
 * the `f-canvas` `[position]`/`[scale]` inputs. `position` is `undefined` until
 * the canvas is actually panned (the default), which leaves `[position]` free
 * so the canvas can center itself on first render.
 */
export interface IFStateTransform {
  position?: IPoint;
  scale: number;
}

/** The whole graph, as it goes in (`load`) and comes out (`snapshot`). */
export interface IFStateData<
  TNode extends IFStateNode = IFStateNode,
  TConnection extends IFStateConnection = IFStateConnection,
  TGroup extends IFStateGroup = IFStateGroup,
> {
  nodes: TNode[];
  connections: TConnection[];
  groups: TGroup[];
  /**
   * The canvas pan/zoom. Restored on `load` and present in every `snapshot`.
   * Omitted on load resets it to the identity transform.
   */
  transform?: IFStateTransform;
}
