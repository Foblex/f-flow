export function isMobile(): boolean {
  return /android|iPad|iPhone|iPod/i.test(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    navigator.userAgent || navigator.vendor || window['opera'],
  );
}
