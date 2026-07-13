import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { IPoint } from '@foblex/2d';
import {
  CallCenterConnectionRecord,
  CallCenterFlowSnapshot,
  CallCenterNodeRecord,
  ICallCenterNodeOutput,
  isCallCenterNodeType,
} from '../domain';

interface ILegacyConnection {
  id?: unknown;
  source?: unknown;
  sourceId?: unknown;
  target?: unknown;
  targetId?: unknown;
}

const FLOW_STORAGE_KEY_PREFIX = 'flow';

@Injectable()
export class CallCenterFlowStorage {
  private readonly _document = inject(DOCUMENT);

  public load(flowId: string): CallCenterFlowSnapshot | null {
    const raw = this._getStorage()?.getItem(this._getKey(flowId));
    if (!raw) {
      return null;
    }

    try {
      return this._normalizeSnapshot(JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }

  public save(flowId: string, snapshot: CallCenterFlowSnapshot): void {
    this._getStorage()?.setItem(this._getKey(flowId), JSON.stringify(snapshot));
  }

  public clear(flowId: string): void {
    this._getStorage()?.removeItem(this._getKey(flowId));
  }

  private _normalizeSnapshot(value: unknown): CallCenterFlowSnapshot | null {
    if (!this._isRecord(value)) {
      return null;
    }

    const nodes = this._toValues(value['nodes']).filter((node): node is CallCenterNodeRecord =>
      this._isNode(node),
    );
    const connections = this._toValues(value['connections'])
      .map((connection) => this._normalizeConnection(connection))
      .filter((connection): connection is CallCenterConnectionRecord => connection !== null);
    const transform = this._normalizeTransform(value['transform']);

    return { nodes, groups: [], connections, transform };
  }

  private _normalizeConnection(value: unknown): CallCenterConnectionRecord | null {
    if (!this._isRecord(value)) {
      return null;
    }

    const connection = value as ILegacyConnection;
    const sourceId = connection.sourceId ?? connection.source;
    const targetId = connection.targetId ?? connection.target;
    if (
      typeof connection.id !== 'string' ||
      typeof sourceId !== 'string' ||
      typeof targetId !== 'string'
    ) {
      return null;
    }

    return { id: connection.id, sourceId, targetId };
  }

  private _normalizeTransform(value: unknown): CallCenterFlowSnapshot['transform'] {
    if (
      !this._isRecord(value) ||
      typeof value['scale'] !== 'number' ||
      (value['position'] !== undefined && !this._isPoint(value['position']))
    ) {
      return undefined;
    }

    return {
      position: value['position'] as IPoint | undefined,
      scale: value['scale'],
    };
  }

  private _isNode(value: unknown): boolean {
    return (
      this._isRecord(value) &&
      typeof value['id'] === 'string' &&
      isCallCenterNodeType(value['type']) &&
      this._isPoint(value['position']) &&
      Array.isArray(value['outputs']) &&
      value['outputs'].every((output) => this._isNodeOutput(output))
    );
  }

  private _isNodeOutput(value: unknown): value is ICallCenterNodeOutput {
    return (
      this._isRecord(value) && typeof value['id'] === 'string' && typeof value['label'] === 'string'
    );
  }

  private _isPoint(value: unknown): value is IPoint {
    return (
      this._isRecord(value) && typeof value['x'] === 'number' && typeof value['y'] === 'number'
    );
  }

  private _isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
  }

  private _toValues(value: unknown): unknown[] {
    if (Array.isArray(value)) {
      return value;
    }

    return this._isRecord(value) ? Object.values(value) : [];
  }

  private _getStorage(): Storage | null {
    return this._document.defaultView?.localStorage ?? null;
  }

  private _getKey(flowId: string): string {
    return FLOW_STORAGE_KEY_PREFIX + flowId;
  }
}
