# Connection Center

## ⚠️ Deprecated

The `fConnectionCenter` directive is deprecated and should not be used in new projects.
Instead, use the more flexible [fConnectionContent](./examples/connection-content) directive, which allows you to place multiple elements (labels, icons, buttons) anywhere along a connection with full control over position, offset, and alignment.

## Description

The `fConnectionCenter` directive allows you to insert any custom content inside a block, which will be positioned relative to the center of the connection line. This is useful for adding labels, icons, or other elements that need to be dynamically displayed at the center of a connection.
The directive provides flexible styling and positioning, allowing you to fully customize the appearance and behavior of the centered content.

## Example

::: ng-component <connection-center></connection-center> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-center/connection-center.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-center/connection-center.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-center/connection-center.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
