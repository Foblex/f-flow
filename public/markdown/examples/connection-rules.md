# Connection Rules

## Description

This example demonstrates how to **control which input connectors can be connected** to a given output connector.
The rules work in two ways:

- **By input ID** (fInputId)
- **By input category** (fInputCategory – a free string label for grouping inputs)

On the output side you define the array fCanBeConnectedInputs, which may include specific input IDs and/or categories.
During a drag operation, the system checks whether the target input’s ID or category is present in that array — only then the connection is allowed.

## Visual feedback

When a connection starts being dragged:

- The container receives the CSS class .f-connections-dragging.
- Every input connector that can accept the connection gets the class .f-connector-connectable.
- Inputs without this class are considered invalid targets, and in the example they are styled with a disabled background color.

This gives the user immediate feedback about which inputs are connectable.

## Example

::: ng-component <connection-rules></connection-rules> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
