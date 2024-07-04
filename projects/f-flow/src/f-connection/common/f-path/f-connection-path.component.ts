import { ChangeDetectionStrategy, Component, ElementRef, Inject } from "@angular/core";
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
  selector: "path[f-connection-path]",
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection-path",
    '[attr.id]': 'attrConnectionId',
    '[attr.data-f-path-id]': 'fPathId',
    '[attr.stroke]': 'linkToGradient',
  },
  providers: [ { provide: CONNECTION_PATH, useExisting: FConnectionPathComponent } ],
})
export class FConnectionPathComponent implements IConnectionPath {

  public get fPathId(): string {
    return this.base.fConnectionId;
  }

  public get linkToGradient(): string {
    return F_CONNECTION_IDENTIFIERS.linkToGradient(
      this.base.fConnectionId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get attrConnectionId(): string {
    return F_CONNECTION_IDENTIFIERS.connectionId(
      this.base.fConnectionId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get hostElement(): SVGPathElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<SVGPathElement>,
    @Inject(F_CONNECTION) private base: IHasConnectionColor & IHasConnectionFromTo
  ) {
  }

  public initialize(): void {
    this.deselect();
  }

  public setPath(path: string): void {
    this.hostElement.setAttribute("d", `${ path }`);
  }

  public select(): void {
    this.hostElement.setAttribute('marker-start', `url(#${ getMarkerSelectedStartId(this.base.fConnectionId) })`);
    this.hostElement.setAttribute('marker-end', `url(#${ getMarkerSelectedEndId(this.base.fConnectionId) })`);
  }

  public deselect(): void {
    this.hostElement.setAttribute('marker-start', `url(#${ getMarkerStartId(this.base.fConnectionId) })`);
    this.hostElement.setAttribute('marker-end', `url(#${ getMarkerEndId(this.base.fConnectionId) })`);
  }
}
