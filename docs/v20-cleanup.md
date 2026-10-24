# v20 cleanup plan

Everything below is marked `@deprecated` in 19.4 and scheduled for removal from the public
API of `@foblex/flow` in v20. The standalone packages (`@foblex/platform`, `@foblex/mediator`,
`@foblex/utils`, `@foblex/2d`) stay published on npm — applications that still need a removed
helper should depend on the standalone package directly.

Rule: deprecated code gets no fixes or improvements — known issues are documented in the
deprecation notes and die with the symbol.

## Vendored mediator (`src/_libs/f-mediator`)

- Remove `deprecated-public-api.ts` and its export from `public-api.ts` (all 7 aliases:
  `FMediator`, `FExecutionRegister`, `FValidatorRegister`, `IExecution`, `IHandler`,
  `IValidator`, `Pipeline`).
- Remove the legacy explicit-generic `execute<TResponse>(request: object)` overload once the
  public re-export is gone (internal call sites already rely on the inferred overload).

## Vendored platform (`src/_libs/f-platform`)

- Remove the deprecated `PlatformService` browser flags (8), the local-storage services, and
  `IWindowService.open` / `location` / `isMediaQuery`.

## Vendored utils (`src/_libs/f-utils`)

- Remove `deprecated-public-api.ts` and its export from `public-api.ts` (all 18 aliases).
  The library keeps using the internal copies; `castToBoolean`/`castToNumber`/`isNumber` are
  redundant with Angular's `booleanAttribute`/`numberAttribute` input transforms.

## Vendored 2d (`src/_libs/f-2d`)

Everything stays exported as before; symbols with zero call sites inside the library are
marked `@deprecated` right in their declarations and scheduled for removal in v20:

- `findClosestAlignment`, `IHasSize`, `PointInput`
- `PointExtensions.castToPoint` / `copy` / `roundTo` / `hypotenuse` / `distance` /
  `getMinimum` / `getMaximum`, `Point.subNumber`
- `LineExtensions.copy` / `hypotenuse`, `RectExtensions.addPointToSize`,
  `RoundedRect.fromPoint`, `SizeExtensions.isEqual`, `TransformModelExtensions.fromString`,
  `VectorExtensions.add` / `scale`

Not marked because they still have internal references, though no library feature reaches
them: `Point.matrixTransform` ↔ `PointExtensions.matrixTransform` (only call each other),
`parseTransformModel` (called only by the deprecated `fromString`).

Known quirks in the unused helpers, left as-is on purpose (they behaved this way in every
published `@foblex/2d`): `parseTransformModel` / `fromString` only parse space-separated
matrix strings — comma-separated input (`getComputedStyle` output, and the output of
`TransformModelExtensions.toString`) yields `NaN`; `LineExtensions.copy` returns a new line
shell that shares the original point objects.

## Example apps (post-19.4 release)

Migrate `libs/f-examples` and `apps/example-apps` off direct `@foblex/platform` /
`@foblex/utils` / `@foblex/2d` imports onto `@foblex/flow` (or keep the standalone deps in
their own package.json for the downloadable examples) — the root workspace keeps the npm
packages installed until then.
