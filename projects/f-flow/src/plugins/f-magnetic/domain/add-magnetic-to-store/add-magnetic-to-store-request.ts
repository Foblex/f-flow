import { FMagneticLinesBase } from '../../components';

export class AddMagneticToStoreRequest {
  static readonly fToken = Symbol('AddMagneticToStoreRequest');
  constructor(
    public readonly instance: FMagneticLinesBase,
    public readonly name: string,
  ) {}
}
