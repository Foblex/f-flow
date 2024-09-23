# Background

**Selector:** f-background

The **FBackgroundComponent** is an Angular component that serves as a background layer for the canvas, providing pattern-based background designs. This component supports dynamic patterns, such as circles and rectangles, which can adapt to transformations like scaling and positioning.

## Standard patterns

#### Circle Pattern

The **FCirclePatternComponent** creates a circle pattern within the background. It uses the provided color and radius inputs to define the appearance of the circles.

#### Rect Pattern

The **FRectPatternComponent** creates a rectangle pattern within the background. It uses vertical and horizontal colors and sizes to define the appearance of the grid lines.

#### Custom Pattern

You can also provide a custom pattern by implementing the **IFBackgroundPattern** interface and providing it as **F_BACKGROUND_PATTERN** in the component’s providers array. This interface has a single method,
**setTransform**, which receives a transformation model and applies the transformation logic to the pattern. The 
**setTransform** method is called every time the flow component is transformed.

```typescript
@Component({
  selector: "custom-pattern",
  template: ``, // Your custom pattern template
  providers: [
    { provide: F_BACKGROUND_PATTERN, useExisting: CustomPattern }
  ]
})
export class CustomPattern implements IFBackgroundPattern {
  
  setTransform(transform: ITransformModel): void {
    // Implement the transformation logic
  }
}
```

## Styles

- `.f-component` A general class applied to all F components for shared styling.

- `.f-background` Specific class for styling the FBackgroundComponent component.

## Usage

You can easily integrate a circle pattern into your canvas background. The following example demonstrates how to use the f-circle-pattern component within the f-background.

::: code-group
```html [circle-pattern]

<f-flow>
  |:|<f-background>|:|
    |:|<f-circle-pattern></f-circle-pattern>|:|
  |:|</f-background>|:|
</f-flow>
```

```html [rect-pattern]

<f-flow>
  |:|<f-background>|:|
    |:|<f-rect-pattern></f-rect-pattern>|:|
  |:|</f-background>|:|
</f-flow>
```
:::

#### Setting Color and Size of the Pattern

You can customize the pattern’s appearance by setting the color and size directly through the component’s inputs. This allows for dynamic adjustments to fit various design requirements.

::: code-group
```html [circle-pattern]
<f-flow>
  |:|<f-background>|:|
    |:|<f-circle-pattern [color]="'#ff0000'" [radius]="50"></f-circle-pattern>|:|
  |:|</f-background>|:|
</f-flow>
```

```html [rect-pattern]
<f-flow>
  |:|<f-background>|:|
    |:|<f-rect-pattern [vColor]="'#ff0000'" [hColor]="'#00ff00'" [vSize]="50" [hSize]="30"></f-rect-pattern>|:|
  |:|</f-background>|:|
</f-flow>
```
:::

#### Setting Color Through CSS

Alternatively, you can set the color of the patterns through CSS for more centralized styling control. This approach is useful for maintaining a consistent look across multiple components.

::: code-group
```css [circle-pattern]
.f-background {
  circle {
    fill: #ff0000;
  }
}
```

```css [rect-pattern]
.f-background {
  line {
    stroke: #ff0000;
  }
}
```
:::

## Examples

::: ng-component <background-example></background-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/background-example/background-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/background-example/background-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/background-example/background-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
