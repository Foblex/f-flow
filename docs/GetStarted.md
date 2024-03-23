#### Getting Started with Foblex Flow
##### Introduction

Foblex Flow is a flexible library for Angular, designed for creating interactive graphs and diagrams.
This guide will assist you in integrating Foblex Flow into your project and leveraging its unique features.

##### Installation

To install Foblex Flow, run the following command in your Angular project:

````bash
npm install @foblex/flow 
````
This command will add Foblex Flow to your package.json and offer to create a default theme.

##### Using Components

Add the Foblex Flow component to your HTML template:
````html
<f-flow>
    <f-canvas>
        <f-connection fOutputId="1" fInputId="2"></f-connection>
        <div fNode [fNodePosition]="{ x:100, y:100 }">
            Node content
            <div fNodeOutput fOutputId="1">Connector</div>
        </div>
        <div fNode [fNodePosition]="{ x:300, y:100 }">
            Node content
            <div fNodeInput fInputId="2">Connector</div>
        </div>
    </f-canvas>
</f-flow>
````
* [f-flow](#FFlowComponent) component acts as the primary container, managing the layout and interactions of all child visualization components within the flow.

* [f-canvas](#FCanvasComponent) component within [f-flow](#FFlowComponent) provides the foundation for placing other components such as nodes and connections.

* [f-connection](#FConnectionComponent) component creates a visual link between nodes. In this case, it connects a node with [fOutputId](#FNodeOutputDirective)="1" to a node with [fInputId](#FNodeInputDirective)="2".

* [fNode](#FNodeDirective) represents a node in the flow and can be configured using properties like [fNodePosition](#FNodeDirective) to define its position.

* The [fNodeOutput](#FNodeOutputDirective) and [fNodeInput](#FNodeInputDirective) directives inside the nodes define connection points (outputs and inputs respectively) for establishing connections.

##### Features and Plugins
Foblex Flow offers unique functions and plugins for enhanced capabilities:
1. [f-mini-map](#FMiniMapComponent): A plugin that provides an overview of the entire graph, facilitating easy navigation and a comprehensive view of diagrams.

2. [f-line-alignment](#FLineAlignmentComponent): This plugin allows for aligning elements to a grid, ensuring precise and orderly placement of components.

3. [f-selection-area](#FSelectionAreaComponent): A plugin for selecting and managing multiple elements on the graph, simplifying the scaling and control of large diagrams.

4. [f-background](#FBackgroundComponent): A plugin for adding a background image to the graph, allowing for the creation of diagrams with a custom look and feel.

##### Conclusion
Foblex Flow is a powerful tool for creating complex graphical interfaces in Angular. For more information on the capabilities and components of the library, refer to the Foblex Flow documentation.
