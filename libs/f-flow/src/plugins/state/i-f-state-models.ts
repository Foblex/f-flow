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

/** The whole graph, as it goes in (`load`) and comes out (`snapshot`). */
export interface IFStateData<
  TNode extends IFStateNode = IFStateNode,
  TConnection extends IFStateConnection = IFStateConnection,
  TGroup extends IFStateGroup = IFStateGroup,
> {
  nodes: TNode[];
  connections: TConnection[];
  groups: TGroup[];
}
