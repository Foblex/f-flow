# Custom Path with Control Points

## Description

This feature allows you to create custom connection paths with multiple control points, ideal for industrial diagrams like P&ID (Piping and Instrumentation Diagrams), circuit diagrams, and process flow diagrams where precise manual positioning of connection paths is required.

Instead of relying on automatic path calculation, you can define exactly where the connection should route by providing an array of intermediate control points between the source and target nodes.

## Key Features

- **Multiple Control Points**: Define as many intermediate points as needed for complex paths
- **Rounded Corners**: Automatically applies smooth corners at control points using quadratic bezier curves
- **Flexible Routing**: Perfect for industrial diagrams requiring specific routing patterns
- **Easy to Use**: Simply provide an array of points through the `fControlPoints` input

## Use Cases

- **P&ID Diagrams**: Route pipes and flow lines around equipment
- **Circuit Diagrams**: Position wires and traces precisely
- **Process Flow Diagrams**: Control flow paths through different process stages
- **Architectural Plans**: Route connections along specific paths

## Example

::: ng-component <custom-path-control-points></custom-path-control-points> [height]="700"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-path-control-points/custom-path-control-points.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-path-control-points/custom-path-control-points.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-path-control-points/custom-path-control-points.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## How to Use

To create a custom path connection, set the connection type to `custom-path` and provide an array of control points:

```html
<f-connection
  fType="custom-path"
  fOutputId="output1"
  fInputId="input1"
  [fControlPoints]="[
    { x: 150, y: 50 },
    { x: 150, y: 100 }
  ]"
  [fRadius]="8"
>
</f-connection>
```

### Parameters

- **fType**: Set to `"custom-path"` to use the custom path builder
- **fControlPoints**: Array of `{ x: number, y: number }` points defining the intermediate path
- **fRadius**: (Optional) Controls the roundness of corners at control points (default: 8)

## Advanced Usage

You can dynamically update control points in your component:

```typescript
export class MyComponent {
  public controlPoints = [
    { x: 100, y: 50 },
    { x: 100, y: 100 },
    { x: 200, y: 100 }
  ];

  public updatePath() {
    // Modify control points based on user interaction
    this.controlPoints = [
      { x: 150, y: 75 },
      { x: 150, y: 125 }
    ];
  }
}
```

## Future Enhancements

While the current implementation allows you to specify control points programmatically, future enhancements may include:

- Interactive drag handles for each control point
- Visual controls for adding/removing control points
- Snap-to-grid functionality for control points
- Automatic control point optimization

## Tips

1. **Start Simple**: Begin with 1-2 control points and add more as needed
2. **Use Rounded Corners**: Set `fRadius` to create smoother, more professional-looking paths
3. **Plan Your Routes**: Sketch out your desired path before defining control points
4. **Store Paths**: Save control point arrays in your data model for persistence
