import { IPoint, ISize } from '@foblex/2d';

/**
 * A node as the state plugin stores it. `data` carries the application
 * payload; everything else maps 1:1 onto `fNode` inputs.
 */
export interface IFStateNode<TData = unknown> {
  id: string;
  position: IPoint;
  size?: ISize;
  rotate?: number;
  parentId?: string | null;
  /** Free-form discriminator for `@switch`-based node templates. */
  type?: string;
  data?: TData;
}

/**
 * A connection as the state plugin stores it. `sourceId`/`targetId` are
 * CONNECTOR ids — the same values `fSourceId`/`fTargetId` bind to.
 */
export interface IFStateConnection<TData = unknown> {
  id: string;
  sourceId: string;
  targetId: string;
  /** Free-form discriminator for connection templates. */
  type?: string;
  data?: TData;
}

/** The whole graph, as it goes in (`load`) and comes out (`snapshot`). */
export interface IFStateData<TNode = unknown, TConnection = unknown> {
  nodes: IFStateNode<TNode>[];
  connections: IFStateConnection<TConnection>[];
}
