export class CenterGroupOrNodeRequest {
  static readonly fToken = Symbol('CenterGroupOrNodeRequest');
  constructor(
    public id: string,
    public animated: boolean,
    public emitCanvasChange: boolean = true,
  ) {}
}
