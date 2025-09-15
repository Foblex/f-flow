# Connection Text

## ⚠️ Deprecated

The `fText` property on connections is deprecated.
For adding text, labels, or any custom markup along a connection, you should now use the more powerful [fConnectionContent](./examples/connection-content) directive. It provides full control over position, offset, alignment, and supports placing multiple elements on a single connection.

## Description

This guide demonstrates how to add text to connections in Foblex Flow for Angular. To add text to a connection, you need to set the `fText` property of the connection component. The text will be displayed in the middle of the connection line. Also, you can set `fTextStartOffset` parameter to adjust the text position along the connection line.
You can customize the text appearance using css styles.

## Example

::: ng-component <connection-text></connection-text> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-text/connection-text.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-text/connection-text.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-text/connection-text.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
