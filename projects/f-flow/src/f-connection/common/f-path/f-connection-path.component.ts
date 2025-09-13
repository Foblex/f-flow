import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionColor } from '../i-has-connection-color';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { F_CONNECTION } from '../f-connection.injection-token';
import { CONNECTION_PATH, IConnectionPath } from './i-connection-path';
import {
  getMarkerEndId,
  getMarkerSelectedEndId,
  getMarkerSelectedStartId,
  getMarkerStartId,
} from './get-path-marker-id';

@Component({
  selector: 'path[f-connection-path]',
  template: '',
  styleUrls: ['./f-connection-path.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-path',
    '[attr.id]': 'attrConnectionId',
    '[attr.data-f-path-id]': 'fPathId',
    '[attr.stroke]': 'linkToGradient',
  },
  providers: [{ provide: CONNECTION_PATH, useExisting: FConnectionPathComponent }],
})
export class FConnectionPathComponent implements IConnectionPath {
  public readonly hostElement = inject(ElementRef<SVGPathElement>).nativeElement;
  private readonly _base = inject(F_CONNECTION) as IHasConnectionColor & IHasConnectionFromTo;

  public get fPathId(): string {
    return this._base.fId();
  }

  public get linkToGradient(): string {
    return F_CONNECTION_IDENTIFIERS.linkToGradient(
      this._base.fId() + this._base.fOutputId() + this._base.fInputId(),
    );
  }

  public get attrConnectionId(): string {
    return F_CONNECTION_IDENTIFIERS.connectionId(
      this._base.fId() + this._base.fOutputId() + this._base.fInputId(),
    );
  }

  public initialize(): void {
    this.deselect();
  }

  public setPath(path: string): void {
    this.hostElement.setAttribute('d', `${path}`);
  }

  public select(): void {
    this.hostElement.setAttribute(
      'marker-start',
      `url(#${getMarkerSelectedStartId(this._base.fId())})`,
    );
    this.hostElement.setAttribute(
      'marker-end',
      `url(#${getMarkerSelectedEndId(this._base.fId())})`,
    );
  }

  public deselect(): void {
    this.hostElement.setAttribute('marker-start', `url(#${getMarkerStartId(this._base.fId())})`);
    this.hostElement.setAttribute('marker-end', `url(#${getMarkerEndId(this._base.fId())})`);
  }
}
