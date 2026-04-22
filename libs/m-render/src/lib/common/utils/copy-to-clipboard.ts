import { from, map, Observable, of, switchMap } from 'rxjs';

export function copyToClipboard(value: string): Observable<void | undefined> {
  const blob = new Blob([ value ], { type: 'text/plain' });
  const data = [ new ClipboardItem({ [ blob.type ]: blob }) ];

  return from(window.navigator.permissions.query({ name: 'clipboard-write' as PermissionName })).pipe(
    map((permission) => permission.state !== 'denied'),
    switchMap((isGranted) => (isGranted ? from(navigator.clipboard.write(data)) : of(undefined))),
  );
}
