---
publishedAt: "2026-04-06"
updatedAt: "2026-04-06"
---

# Angular Version Compatibility

Use this page to answer one practical question: **which `@foblex/flow` version should I install for my Angular version, and which companion packages belong with it?**

If you use the current `18.x` line, `ng add @foblex/flow` installs companion packages automatically.  
If you need to pin an older line, use the manual install commands below.

## Quick matrix

| Your Angular app    | Recommended Foblex Flow line | Why                                                                                                    |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Angular 17.3+       | `18.x`                       | Current line for modern Angular apps. Angular 17.3 through Angular 20+ use the same install path here. |
| Angular 16.1 - 17.2 | `17.4.x`                     | Safe transition line if you do not want to jump straight onto the newest line.                         |
| Angular 12 - 16.0   | `16.0.x`                     | Safe legacy line before the newer Angular API floor.                                                   |
| Angular 12 - 15     | `12.6.3`                     | Legacy `@foblex/core` line. Use this if you are staying on the old dependency family.                  |

## Manual install commands

### Angular 17.3+

```bash
npm install @foblex/flow@18 @foblex/platform@1.0.4 @foblex/mediator@1.1.3 @foblex/2d@1.2.2 @foblex/utils@1.1.1
```

If you want to stay on the last `17.x` release line:

```bash
npm install @foblex/flow@17.9.5 @foblex/platform@1.0.4 @foblex/mediator@1.1.3 @foblex/2d@1.2.1 @foblex/utils@1.1.1
```

### Angular 16.1 - 17.2

```bash
npm install @foblex/flow@17.4.0 @foblex/platform@1.0.4 @foblex/mediator@1.1.2 @foblex/2d@1.1.9 @foblex/utils@1.1.1 @foblex/drag-toolkit@1.1.0
```

### Angular 12 - 16.0

```bash
npm install @foblex/flow@16.0.0 @foblex/platform@1.0.3 @foblex/mediator@1.1.0 @foblex/2d@1.1.0 @foblex/utils@1.1.0 @foblex/drag-toolkit@1.1.0
```

### Angular 12 - 15, legacy `@foblex/core` line

```bash
npm install @foblex/flow@12.6.3 @foblex/core@1.2.6 @foblex/platform@1.0.3
```

## Companion packages by line

| Foblex Flow line | Companion packages you should install manually                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `18.x`           | `@foblex/platform@1.0.4`, `@foblex/mediator@1.1.3`, `@foblex/2d@1.2.2`, `@foblex/utils@1.1.1`                               |
| `17.9.5`         | `@foblex/platform@1.0.4`, `@foblex/mediator@1.1.3`, `@foblex/2d@1.2.1`, `@foblex/utils@1.1.1`                               |
| `17.4.0`         | `@foblex/platform@1.0.4`, `@foblex/mediator@1.1.2`, `@foblex/2d@1.1.9`, `@foblex/utils@1.1.1`, `@foblex/drag-toolkit@1.1.0` |
| `16.0.0`         | `@foblex/platform@1.0.3`, `@foblex/mediator@1.1.0`, `@foblex/2d@1.1.0`, `@foblex/utils@1.1.0`, `@foblex/drag-toolkit@1.1.0` |
| `12.6.3`         | `@foblex/core@1.2.6`, `@foblex/platform@1.0.3`                                                                              |

## Short notes

- Angular `17.3+`: use `18.x` unless users report a concrete break in a newer Angular major.
- Angular control flow with projected nodes or connections: prefer `18.0.0+`.
- For older pinned lines, manual installation is clearer than relying on `ng add`.
- Angular already brings its own compatible `@angular/core`, `@angular/common`, and RxJS versions. The commands above focus on the extra Foblex companion packages you need to match manually.
