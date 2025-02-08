import { from, map, Observable, of, switchMap } from 'rxjs';

export function copyToClipboard(value: string): Observable<any | undefined> {
  const blob = new Blob([ value ], { type: 'text/plain' });
  const data = [ new ClipboardItem({ [ blob.type ]: blob }) ];

  // @ts-ignore
  return from(window?.navigator.permissions.query({ name: 'clipboard-write' })).pipe(
    map((permission: PermissionStatus) => {
      return permission.state !== 'denied';
    }),
    switchMap((isGranted: boolean) => {
      if (isGranted) {
        return from(navigator.clipboard.write(data));
      }
      return of(undefined);
    })
  );
}
