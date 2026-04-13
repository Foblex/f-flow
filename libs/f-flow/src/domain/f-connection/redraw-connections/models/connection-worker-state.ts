import { Injectable } from '@angular/core';
import { TConnectionWorkerPendingRequest } from './t-connection-worker-pending-request';
import { revokeConnectionWorkerUrl } from '../worker/runtime/connection-worker-runtime';

@Injectable()
export class ConnectionWorkerState {
  public worker: Worker | null = null;
  public workerUrl: string | null = null;

  public nextRequestId = 0;
  public isDisabled = false;

  public pending = new Map<number, TConnectionWorkerPendingRequest>();

  public resetRuntime(error: Error): void {
    this.pending.forEach((request) => request.reject(error));
    this.pending.clear();

    this.worker?.terminate();
    this.worker = null;

    revokeConnectionWorkerUrl(this.workerUrl);
    this.workerUrl = null;
  }

  public dispose(): void {
    this.resetRuntime(new Error('Connection worker was destroyed.'));
  }
}
