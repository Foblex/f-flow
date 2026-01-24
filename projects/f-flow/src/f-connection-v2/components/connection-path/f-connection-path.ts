import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { normalizeDomElementId } from '@foblex/utils';
import { F_CONNECTION_PATH, FConnectionPathBase } from './models';
import { createConnectionDomIdentifier, createGradientDomUrl } from '../../utils';
import { F_CONNECTION_COMPONENTS_PARENT } from '../../models';

@Component({
  selector: 'path[f-connection-path]',
  template: '',
  styleUrls: ['./f-connection-path.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-path',
    '[attr.id]': 'attrConnectionId',
    '[attr.data-f-path-id]': 'fPathId',
    '[attr.stroke]': 'linkToGradient',
  },
  providers: [
    {
      provide: F_CONNECTION_PATH,
      useExisting: FConnectionPath,
    },
  ],
})
export class FConnectionPath extends FConnectionPathBase {
  private readonly _connection = inject(F_CONNECTION_COMPONENTS_PARENT);

  public get fPathId(): string {
    return this._connection.fId();
  }

  public get linkToGradient(): string {
    return createGradientDomUrl(
      this._connection.fId(),
      this._connection.fOutputId(),
      this._connection.fInputId(),
    );
  }

  public get attrConnectionId(): string {
    return createConnectionDomIdentifier(
      this._connection.fId(),
      this._connection.fOutputId(),
      this._connection.fInputId(),
    );
  }

  public override initialize(): void {
    this.deselect();
  }

  public override setPath(path: string): void {
    this.hostElement.setAttribute('d', `${path}`);
  }

  public override select(): void {
    this.hostElement.setAttribute(
      'marker-start',
      `url(#${getMarkerSelectedStartId(this._connection.fId())})`,
    );
    this.hostElement.setAttribute(
      'marker-end',
      `url(#${getMarkerSelectedEndId(this._connection.fId())})`,
    );
  }

  public override deselect(): void {
    this.hostElement.setAttribute(
      'marker-start',
      `url(#${getMarkerStartId(this._connection.fId())})`,
    );
    this.hostElement.setAttribute('marker-end', `url(#${getMarkerEndId(this._connection.fId())})`);
  }
}

function getMarkerStartId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-marker-start-${fConnectionId}`);
}

function getMarkerEndId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-marker-end-${fConnectionId}`);
}

function getMarkerSelectedStartId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-selected-marker-start-${fConnectionId}`);
}

function getMarkerSelectedEndId(fConnectionId: string): string {
  return normalizeDomElementId(`f-connection-selected-marker-end-${fConnectionId}`);
}
