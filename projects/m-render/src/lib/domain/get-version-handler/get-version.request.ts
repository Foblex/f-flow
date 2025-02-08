import { IDocsVersion } from '../i-docs-version';

export class GetVersionRequest {

  constructor(
    public readonly version: IDocsVersion | undefined
  ) {
  }
}
