import { GetVersionRequest } from './get-version.request';
import { IHandler } from '@foblex/mediator';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IDocsVersion } from '../i-docs-version';

export class GetVersionHandler implements IHandler<GetVersionRequest, Observable<string | undefined>> {

  constructor(
    private http: HttpClient,
  ) {
  }

  public handle(request: GetVersionRequest): Observable<string | undefined> {
    return this.getLocalVersion(request.version) || this.getNpmVersion(request.version);
  }

  private getLocalVersion(version: IDocsVersion | undefined): Observable<string | undefined> | undefined {
    return !!version?.value ? of(version?.value) : undefined;
  }

  private getNpmPackage(version: IDocsVersion | undefined): string | undefined {
    return version?.npmPackage;
  }

  private getNpmVersion(version: IDocsVersion | undefined): Observable<string | undefined> {
    const packageName = this.getNpmPackage(version);
    if (!packageName) {
      return of(undefined);
    }

    return this.http.get<{ 'dist-tags': { latest: string } }>(this.getNpmRegistry(packageName)).pipe(
      map((response) => response[ 'dist-tags' ]?.latest),
      catchError(() => of(undefined))
    );
  }

  private getNpmRegistry(name: string): string {
    return `https://registry.npmjs.org/${ encodeURIComponent(name) }`
  }
}
