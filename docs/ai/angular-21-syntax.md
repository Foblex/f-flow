# Angular 21 Syntax Guide for AI Agents

Use this guide when generating or refactoring Angular code in this repository.

## Scope

- This repository currently uses Angular `20.3.x`.
- Treat this document as the target style for modern Angular authoring and for future Angular 21 migrations.
- Only use APIs that exist in the currently installed Angular version.
- Do not introduce Angular 21 experimental APIs into production code unless the feature explicitly opts in.
- If a local file already uses an older Angular style, preserve local consistency unless the task is an intentional migration.

## Default stance

For new Angular code, prefer:

- standalone components, directives, and pipes
- built-in control flow: `@if`, `@for`, `@switch`, `@let`, `@defer`
- signals for local state: `signal`, `computed`, `linkedSignal`
- signal component APIs: `input`, `output`, `model`
- signal queries: `viewChild`, `viewChildren`, `contentChild`, `contentChildren`
- `inject()` over constructor parameter injection

Avoid by default in new code:

- `*ngIf`, `*ngFor`, `*ngSwitch`
- `@Input`, `@Output`, `EventEmitter`, `@ViewChild`, `@ContentChild`
- NgModule-first architecture for new features
- using `effect()` to propagate state from one signal into another

## 1. Components and standalone authoring

Angular components are standalone by default in modern Angular.

Write:

```ts
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './user-card.html',
})
export class UserCard {
  readonly user = input.required<User>();
  readonly selected = model(false);
  readonly closed = output<void>();

  private readonly _userService = inject(UserService);

  readonly displayName = computed(() => this.user().name.trim());
}
```

Do not write for new code:

```ts
@Component({
  selector: 'app-user-card',
  standalone: false,
})
export class UserCard {
  @Input() user!: User;
  @Output() closed = new EventEmitter<void>();

  constructor(private readonly userService: UserService) {}
}
```

Rules:

- Prefer standalone declarables for new features.
- Use `imports` directly on the component.
- Keep `ChangeDetectionStrategy.OnPush`.
- Do not add `standalone: false` unless you are extending an older module-based slice on purpose.

## 2. Template control flow

Prefer built-in control flow syntax in all new templates.

### `@if`

Write:

```html
@if (user(); as userValue) {
  <app-avatar [user]="userValue" />
} @else {
  <app-skeleton-avatar />
}
```

Do not write:

```html
<app-avatar *ngIf="user() as userValue; else avatarFallback" [user]="userValue" />
<ng-template #avatarFallback>
  <app-skeleton-avatar />
</ng-template>
```

Use `; as value` when the expression is long or reused.

### `@for`

Write:

```html
@for (item of items(); track item.id; let index = $index) {
  <app-item-row [item]="item" [index]="index" />
} @empty {
  <p>No items yet.</p>
}
```

Do not write:

```html
<app-item-row *ngFor="let item of items(); let index = index" [item]="item" [index]="index" />
```

Rules:

- Always use a meaningful `track` expression.
- Prefer `track item.id` or another stable unique key.
- Use `track $index` only for truly static lists.
- Avoid `track item` when a stable id exists.
- Do not assume `@for` supports `break` or `continue`.

### `@switch`

Write:

```html
@switch (state()) {
  @case ('idle') {
    <app-idle-state />
  }
  @case ('loading') {
    <app-loading-state />
  }
  @case ('error') {
    <app-error-state />
  }
  @default never;
}
```

Do not write:

```html
<ng-container [ngSwitch]="state()">
  <app-idle-state *ngSwitchCase="'idle'" />
  <app-loading-state *ngSwitchCase="'loading'" />
  <app-error-state *ngSwitchCase="'error'" />
</ng-container>
```

Rules:

- Prefer `@switch` for union-state rendering.
- Use `@default never;` when exhaustive type checking is desirable.

### `@let`

Write:

```html
@let total = filteredItems().length;
@let selectedUser = user();

<p>{{ total }} items</p>
@if (selectedUser) {
  <app-user-details [user]="selectedUser" />
}
```

Do not write:

```html
<p>{{ filteredItems().length }} items</p>
<app-user-details *ngIf="user()" [user]="user()!" />
```

Rules:

- Use `@let` to avoid repeating long expressions in a template.
- Do not try to reassign an `@let` variable.
- Keep `@let` scoped to the current view.

## 3. Inputs, outputs, and two-way binding

### `input()`

Write:

```ts
readonly title = input('');
readonly disabled = input(false);
readonly value = input.required<number>();
readonly buttonLabel = input('', { transform: trimString });
```

Do not write for new code:

```ts
@Input() title = '';
@Input() disabled = false;
@Input({ required: true }) value = 0;
```

Rules:

- Prefer `input()` and `input.required()` for new code.
- Use input transforms only when coercion or normalization is actually needed.
- Keep transform functions pure and statically analyzable.
- Prefer `booleanAttribute` / `numberAttribute` where appropriate.

### `output()`

Write:

```ts
readonly saved = output<User>();
readonly closed = output<void>();

save(user: User): void {
  this.saved.emit(user);
}
```

Do not write for new code:

```ts
@Output() saved = new EventEmitter<User>();
@Output() closed = new EventEmitter<void>();
```

Rules:

- Prefer `output()` instead of `EventEmitter`.
- Only call `output()` in component/directive property initializers.

### `model()`

Use `model()` only for actual two-way component APIs.

Write:

```ts
readonly checked = model(false);

toggle(): void {
  this.checked.update((value) => !value);
}
```

```html
<app-toggle [(checked)]="isEnabled" />
```

Do not write:

```ts
readonly query = model('');
readonly page = model(1);
```

when these are just internal component state and not intended as public two-way bindings.

Rules:

- Use `model()` for component values that the child updates and the parent may two-way bind.
- Do not use `model()` as a replacement for every local `signal()`.
- `model()` does not support input transforms.
- Do not confuse component `model()` with Signal Forms models.

## 4. Queries as signals

Prefer signal queries in new code.

Write:

```ts
import { ElementRef, viewChild, viewChildren } from '@angular/core';

readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
readonly rows = viewChildren(ItemRowComponent);
```

Do not write for new code:

```ts
@ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
@ViewChildren(ItemRowComponent) rows!: QueryList<ItemRowComponent>;
```

Rules:

- Query functions return signals, so read them with `this.searchInput()` or `this.rows()`.
- Prefer `viewChild`, `viewChildren`, `contentChild`, `contentChildren`.
- Keep decorator-based queries only when matching an older local slice.

## 5. Dependency injection

Prefer `inject()` over constructor parameter injection.

Write:

```ts
private readonly _http = inject(HttpClient);
private readonly _router = inject(Router);
```

Do not write for new code:

```ts
constructor(
  private readonly http: HttpClient,
  private readonly router: Router,
) {}
```

Rules:

- Use `inject()` in field initializers.
- Remember that `inject()` only works in an injection context.
- Do not call `inject()` from arbitrary instance methods or callbacks.
- If you need DI in a later-executed function, use `runInInjectionContext`.

## 6. Signals and reactivity

Use signals as the default local state model.

Write:

```ts
readonly query = signal('');
readonly users = signal<User[]>([]);

readonly filteredUsers = computed(() => {
  const q = this.query().trim().toLowerCase();
  return this.users().filter((user) => user.name.toLowerCase().includes(q));
});
```

Do not write:

```ts
query = '';
users: User[] = [];

get filteredUsers(): User[] {
  return this.users.filter(...);
}
```

### `linkedSignal()`

Use `linkedSignal()` when a value is both derived and manually writable.

Write:

```ts
readonly selectedUserId = linkedSignal({
  source: () => this.filteredUsers(),
  computation: (users, previous) => {
    const previousId = previous?.value;
    return users.some((user) => user.id === previousId) ? previousId : users[0]?.id ?? null;
  },
});
```

Do not write:

```ts
readonly selectedUserId = signal<string | null>(null);

effect(() => {
  const users = this.filteredUsers();
  if (!users.some((user) => user.id === this.selectedUserId())) {
    this.selectedUserId.set(users[0]?.id ?? null);
  }
});
```

### `effect()`

Use `effect()` only for side effects that synchronize Angular state with imperative APIs.

Acceptable:

- localStorage sync
- analytics
- chart or canvas rendering
- DOM work that cannot be expressed declaratively

Avoid:

- signal A updates signal B
- computed state propagation
- business state orchestration that should live in `computed()` or `linkedSignal()`

If you are deriving data, use `computed()`.
If you are deriving a writable value, use `linkedSignal()`.

### Signal mutation rules

Write:

```ts
this.items.update((items) => [...items, newItem]);
this.user.update((user) => ({ ...user, name }));
this.selectedIds.update((ids) => new Set(ids).add(id));
```

Do not write:

```ts
this.items().push(newItem);
this.user().name = name;
this.selectedIds().add(id);
```

Rules:

- Do not mutate arrays, objects, maps, or sets in place and assume Angular will notice.
- Return a new reference from `set()` or `update()`.

## 7. Deferred loading with `@defer`

Use `@defer` for heavy, below-the-fold, or browser-only UI.

Write:

```html
@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder {
  <app-chart-skeleton />
} @loading (after 150ms; minimum 500ms) {
  <app-chart-loading />
} @error {
  <p>Failed to load chart.</p>
}
```

Rules:

- Use `@defer` for performance, not for basic conditional rendering.
- Deferred declarables must be standalone.
- Do not reference deferred declarables elsewhere in the same file, including queries, or Angular will eagerly load them.
- Use `@placeholder`, `@loading`, and `@error` when the UX benefits from them.

## 8. Forms

### Default rule for this repository

- Keep existing form style consistent within a feature.
- Do not introduce Signal Forms into shared or stable code by default.

### Signal Forms in Angular 21

Angular 21 includes Signal Forms under `@angular/forms/signals`.

Write only when a feature explicitly opts in:

```ts
import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
```

Rules:

- Treat Signal Forms as opt-in, not the default migration target for this repository.
- Do not confuse:
  - `model()` for component two-way binding
  - a form model created from `signal(...)` for Signal Forms

## 9. Experimental APIs

### `resource()`

`resource()` is still experimental.

Rules:

- Do not use `resource()` in stable shared APIs by default.
- If used, use it for read operations only.
- Do not use `resource()` for mutations because it can cancel in-flight work.

### Signal Forms

Signal Forms are modern and promising, but still require explicit feature-level buy-in.

## 10. Short do / don't checklist

Do:

- use `@if`, `@for`, `@switch`, `@let`, `@defer`
- use standalone declarables
- use `signal`, `computed`, `linkedSignal`
- use `input`, `output`, `model`
- use signal queries
- use `inject()`
- use immutable updates with signals

Do not:

- add new `*ngIf`, `*ngFor`, `ngSwitch`
- add new `EventEmitter` outputs
- add new decorator-based inputs/outputs/queries by default
- use `effect()` to shuttle state between signals
- mutate signal values in place
- use `model()` for plain local component state
- use `resource()` or Signal Forms by default in stable library/public code

## Official references

- [Angular components guide](https://angular.dev/guide/components)
- [Inputs](https://angular.dev/guide/components/inputs)
- [Outputs](https://angular.dev/guide/components/outputs)
- [Queries](https://angular.dev/guide/components/queries)
- [Control flow](https://angular.dev/guide/templates/control-flow)
- [Template variables and `@let`](https://angular.dev/guide/templates/variables)
- [`@defer`](https://angular.dev/best-practices/performance/defer)
- [Signals](https://angular.dev/guide/signals)
- [Effects](https://angular.dev/guide/signals/effect)
- [`linkedSignal`](https://angular.dev/api/core/linkedSignal)
- [`resource`](https://angular.dev/api/core/resource)
- [Dependency injection context](https://angular.dev/guide/di/dependency-injection-context)
- [Angular style guide](https://angular.dev/style-guide)
- [Signal Forms models](https://angular.dev/guide/forms/signals/models)
