export class ConvertComputedToPixelsRequest {

  constructor(
    public value: string,
    public clientWidth: number,
    public clientHeight: number,
    public fontSize: string
  ) {
  }
}
