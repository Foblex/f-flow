# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [17.8.0](https://github.com/foblex/flow/compare/v17.7.0...v17.8.0) (2025-09-15)

### Features

- **Connection Content** - [Example](https://flow.foblex.com/examples/connection-content)
  - Added `fConnectionContent` directive for placing custom content (labels, icons, buttons) along connections with position, offset, and alignment options. ([a1cda4a](https://github.com/foblex/flow/commit/a1cda4ab46dc1877d2c6a4a4f8195e3039ff4b97))

- **Connection Validation** - [Example](https://flow.foblex.com/examples/connection-rules)
  - Extended connection validation rules:
    - Previously, connections could only be restricted by **input ID** (`fInputId`).
    - Now, restrictions can also be applied by **input category** (`fInputCategory` — a free string label for grouping).
    - On the output side, developers can define `fCanBeConnectedInputs`, listing allowed IDs and/or categories.
    - During drag, the system checks both; only matching inputs are valid targets.
    - Visual feedback:
      - `.f-connections-dragging` is applied to the container.
      - Valid inputs receive `.f-connector-connectable`.
      - Invalid inputs remain unstyled (example styles dim them).
    - This gives immediate visual feedback and makes rules more flexible for real-world editors.  
      ([704333f](https://github.com/foblex/flow/commit/704333f113dde876068436015417030ddc267648), [1977850](https://github.com/foblex/flow/commit/19778509897a8ddf69d8ad4fd12be0e70e258b4c))
- **UX & Examples**
  - Added redirects for documentation and examples routes, updated sitemap for new URLs. ([ef941ad](https://github.com/foblex/flow/commit/ef941add180a3fd19b9d7e94ad93a5b975197148))
  - Introduced Showcase feature with configuration and example items. ([bfc39fc](https://github.com/foblex/flow/commit/bfc39fc02de7b75f3a909d8241db1e6f57fd9d26))

- **Reactivity & Refactors**
  - Migrated connector IDs and related properties to Angular Signals. ([223460d](https://github.com/foblex/flow/commit/223460de8bd288ece6d6700645e6549f499b9dfb), [9051239](https://github.com/foblex/flow/commit/905123920a68bc145eee6647cdb0a0711c689252), [9cadd41](https://github.com/foblex/flow/commit/9cadd419611d3661747865f2577b8d64ee11787c))
  - Refactored Dagre Layout example and improved connection handling. ([498a86b](https://github.com/foblex/flow/commit/498a86b1b2601338733cdad5a19d95105af5e5e9))

### Deprecations

- Marked `fConnectionCenter` directive and `fText` property as **deprecated**. Use `fConnectionContent` instead. ([8532fba](https://github.com/foblex/flow/commit/8532fba7e87bef005cfad059bd0fe8096cd184ac))

### Bug Fixes

- Updated Angular dependencies to latest patch versions. ([f57f99d](https://github.com/foblex/flow/commit/f57f99de1db36233c8dc716661faf2bf1116313c))
- Updated edit link patterns in documentation and examples configuration. ([d08f54d](https://github.com/foblex/flow/commit/d08f54d3e4b060c574187130f6c597c58c058269))
- Fixed image URLs and demo link in `showcase.ts` for local paths. ([3b428b0](https://github.com/foblex/flow/commit/3b428b08abcfe204d47182c789b4cee054e9d872))
- Added Material Design styles for form fields and select components in test examples. ([0e176b7](https://github.com/foblex/flow/commit/0e176b723a780d6237585c71412463fdffd8ed57))

### Migration Notes

Replace `fText` property:

```html
  <f-connection ... fText="Label"></f-connection>
```

with:

```html
  <f-connection ...>
    <div fConnectionContent [position]="0.5">Label</div>
  </f-connection>
```

Replace `fConnectionCenter directive:

```html
  <f-connection ...>
    <div fConnectionCenter>...</div>
  </f-connection>
```

with:

```html
  <f-connection ...>
    <div fConnectionContent [position]="0.5" align="along">...</div>
  </f-connection>
```

---

## [17.7.0](https://github.com/foblex/flow/compare/v17.5.5...v17.7.0) (2025-08-24)

### Features

- **Grouping Improvements**
  - Refactored the [Grouping Example](https://flow.foblex.com/examples/grouping) and the [Drag-to-Group](https://flow.foblex.com/examples/drag-to-group) Example.
  - Added **fAutoSizeToFitChildren** — automatically resizes parent nodes and groups to fit the combined size of their children.
  - Added **fAutoExpandOnChildHit** — expands parent nodes and groups in real time when child nodes are moved inside and do not fit.
  - Improved drag-to-group behavior: dropping into a node or group that is already part of another parent now correctly validates the target (previously it always defaulted to its existing parent).
- **New Copy/Paste Example**
  - [Copy-Paste Example](https://flow.foblex.com/examples/copy-paste) demonstrates how to implement cut, copy, and paste functionality in Foblex Flow.
  - Shows how to duplicate nodes (with their connections), remove selected elements, and insert them back while keeping IDs and connections consistent.
- **New Undo/Redo Example**
  - [Undo-Redo V2 Example](https://flow.foblex.com/examples/undo-redo-v2) demonstrates how to add undo and redo functionality to a flow editor.
  - Built on top of @foblex/mutator, a lightweight state management utility that tracks state changes, snapshots, and history.
  - Provides a full time-travel editing experience, allowing users to revert and reapply actions for a smoother workflow.

### 🧹 Improvements

- Grouping internals were refactored and clarified, including renaming of execution classes and better separation of responsibilities.

### 📚 Documentation

- Updated documentation to reflect new features and API changes:
  - [FNodeDirective](https://flow.foblex.com/docs/f-node-directive)
  - [FFlowComponent](https://flow.foblex.com/docs/f-flow-component)
  - [FCanvasComponent](https://flow.foblex.com/docs/f-canvas-component)

### 🐞 Bug Fixes

- resolve drag-and-drop issues on macOS by improving event handling ([#187](https://github.com/foblex/flow/issues/187)) ([142745c](https://github.com/foblex/flow/commit/142745c277736b0c43085dde5c6590eb90ca87f1))
- smooth wheel zoom ([#198](https://github.com/foblex/flow/issues/198)) ([e302e75](https://github.com/foblex/flow/commit/e302e75a1116ef585eaf0e6e10b2411c059d7777))

### ⚠️ Breaking Changes

- **CSS Class Rename**:
  - .f-parent-for-drop → .f-grouping-over-boundary
- **New CSS Class**:
  - .f-grouping-drop-active — applied to nodes or groups that are valid drop targets for grouping.

If you are using custom styles based on the old .f-parent-for-drop selector, you will need to update your CSS.

### 🔎 TL;DR

- Groups now support auto-resize and auto-expand on child moves.
- Drag-to-group behavior is more robust.
- Breaking change: CSS class .f-parent-for-drop renamed.
- Documentation updated.
- Two new examples: Copy/Paste and Undo/Redo V2.

## [17.6.0](https://github.com/foblex/flow/compare/v17.5.5...v17.6.0) (2025-07-23)

### Features

- **Improved Connection Reassignment**
  - Enhanced the logic and UX for reassigning connections, allowing both source and target to be dynamically changed.
  - Updated class names for clarity and improved drag handle behavior and styling.  
    ([7aef9f3](https://github.com/foblex/flow/commit/7aef9f3eacc134d1e1c81f66516f4238ae98855d), [bbb6d56](https://github.com/foblex/flow/commit/bbb6d56d35c2b95f8d07f414910a45bd15126a8a), [d8de100](https://github.com/foblex/flow/commit/d8de100cbebfe1c540ad927e0c20b654fedcc0f7))

- **Signal-based Refactors for Reactivity**
  - Refactored the following to use Angular Signals for more efficient change detection and reactivity:
    - `fConnectionCenter`  
      ([421b0ef](https://github.com/foblex/flow/commit/421b0efae24a19c117fd314cbb9cec144384f681), [439760c](https://github.com/foblex/flow/commit/439760c5c1302e16dba7fc0790530225a9e99c63))
    - `fDefs`, `fTextComponent`  
      ([06e9457](https://github.com/foblex/flow/commit/06e94574d154f695174083e2f8d39b4141b20b9d))
    - `fId` across multiple interfaces and components  
      ([3034d5d](https://github.com/foblex/flow/commit/3034d5d19997020745d870bba61be82a0933a914))
    - `fPath` logic  
      ([a1b1314](https://github.com/foblex/flow/commit/a1b131446bc2cb486fcf940458105af1200ae768))
    - `fSelection` initialization and management  
      ([31b6af1](https://github.com/foblex/flow/commit/31b6af1bf68623a0942f5084ad7c41b70f34347e))

- **Minimap Improvements**
  - Restructured the minimap component.
  - Enhanced input handling and upgraded it to support new Angular features.  
    ([c7a3be9](https://github.com/foblex/flow/commit/c7a3be936eecaaa10b4da49c3b77a4ff496dae75))

- **Debounced `fCanvasChange` Event**
  - Added optional debounce to the `fCanvasChange` event in `FCanvasComponent` to reduce event noise during rapid updates.
  - Configurable via debounceTime input
- **New `fDragBlocker` Directive**
  - Introduced fDragBlocker directive to block drag-and-drop interactions within specific areas of the canvas.
  - Useful for excluding certain zones (like panels or overlays) from initiating node movement or connection creation.

### 🐞 Bug Fixes

- **Drag-and-Drop on macOS**
  - Fixed issues with drag-and-drop interactions on macOS by improving event handling.  
    ([#187](https://github.com/foblex/flow/issues/187), [142745c](https://github.com/foblex/flow/commit/142745c277736b0c43085dde5c6590eb90ca87f1))

### ⚠️ Breaking Changes

- **Updated `FReassignConnectionEvent` structure**
  - The event model was redesigned to support both source and target reassignment with more detailed context.

  **Before:**

  ```ts
  new FReassignConnectionEvent(
    fConnectionId: string,
    fOutputId: string,
    oldFInputId: string,
    newFInputId: string | undefined,
    fDropPosition: IPoint
  )
  ```

  **After:**

  ```ts
  new FReassignConnectionEvent(
    connectionId: string,
    isSourceReassign: boolean,
    isTargetReassign: boolean,
    oldSourceId: string,
    newSourceId: string | undefined,
    oldTargetId: string,
    newTargetId: string | undefined,
    dropPoint: IPoint
  )
  ```

  This change improves the accuracy of reassignment tracking and enables more flexible behavior in advanced flow editors.

## [17.5.0](https://github.com/foblex/flow/compare/v17.4.0...v17.5.0) (2025-05-11)

### Features

- Added Angular schematics support for `ng-add` and `ng-update` commands. ([ea3e8ec](https://github.com/foblex/flow/commit/ea3e8ec7b8960e4f6de9f37a35dbfe3633b3dd39))
- Added `fMinimapClass` input for custom minimap node styling. ([7c8e13c](https://github.com/foblex/flow/commit/7c8e13c6ba7c408ea6882600f8c42818f8cfe614))
- Added membership page components and enhanced flow connection properties. ([6170b46](https://github.com/foblex/flow/commit/6170b460790ed401cdc5029f477177ed6bb52089))
- Enhanced resize handle functionality with minimum size support and improved styling. ([29fbcd4](https://github.com/foblex/flow/commit/29fbcd4940571141cfab14897c632f9a0c68e468))
- Implemented node rotation functionality. ([b58f982](https://github.com/foblex/flow/commit/b58f982244fce06bd6d0ae9555a20b4a24db627d))

### Bug Fixes

- Adjusted node positioning calculations to account for transformation scale. ([0295846](https://github.com/foblex/flow/commit/0295846f038297e3780741efe3526e02cad76476))
- Refactored background component executions to use readonly properties and improve dependency injection. ([a18dddd](https://github.com/foblex/flow/commit/a18ddddec255f888e46f060905edaf1417bdcab9))
- Refactored canvas components to use readonly properties and introduce mediatorEffect for better state management. ([5c3512b](https://github.com/foblex/flow/commit/5c3512be2a35d36aa4ed326f06a5c05ec4ad69e3))
- Updated `@foblex/m-render` to version 2.5.9 and incremented package version to 17.4.4. ([c51a174](https://github.com/foblex/flow/commit/c51a1744283a670f371cce361a8cedfa4e46e3f0))
- Fixed drag handler to correctly append and remove elements; added `pointer-events` to connection styles. ([dcc5de3](https://github.com/foblex/flow/commit/dcc5de3524d87189013bab27c6ecc08c2638bf11))
- Fixed `f-background` component to use `ContentChild` decorator and improve pattern handling. ([9fb09ba](https://github.com/foblex/flow/commit/9fb09ba6a073d106a6f2feb7010e96a0d718ddcc))
- Updated node input/output IDs to include index for better connection management. ([95c7691](https://github.com/foblex/flow/commit/95c7691864f0b79ae4551c4c5406ce3f311ada18))

### Documentation

- Added Rotate Handle example. ([1f51f4f](https://github.com/foblex/flow/commit/1f51f4ff8c1e54679dd6cc67138ae574bbc2eb83))

## [17.4.0](https://github.com/foblex/flow/compare/v17.2.1...v17.4.0) (2025-02-10)

### Features

- Added CustomTriggers for fDraggable, fZoom to allow for custom drag and zoom triggers ([34c87b8](https://github.com/foblex/flow/commit/34c87b84fd6ffe9443a61e93c2066f98aae6f1cb))
- Enhance f-flow components with loading handlers and improved styling ([abd779c](https://github.com/foblex/flow/commit/abd779c9bfdf7469955ce83fedb18759083f6f40))
- Added fDragStarted with data and fDragEnded events ([4ef0e17](https://github.com/foblex/flow/commit/4ef0e177eb35060d0eb5de2b90f545f7051476a1))
- Added Connection Validation to prevent connections between incompatible connectors ([4ef0e17](https://github.com/foblex/flow/commit/4ef0e177eb35060d0eb5de2b90f545f7051476a1))
- Added Grid System for fDraggable to allow for movement in grid increments ([23f39c5](https://github.com/foblex/flow/commit/23f39c556536e8d38e91df134f487c40f1715cc9))
- Added fEmitOnNodeIntersect event to know when a node is intersected by connection ([23f39c5](https://github.com/foblex/flow/commit/23f39c556536e8d38e91df134f487c40f1715cc9))
- Refactor styles and components for f-flow integration ([05ada49](https://github.com/foblex/flow/commit/05ada49295eeffbef102c86ead77241ef9a7871b))
- Added Top, Left, Bottom, Right Resize Handles ([05ada49](https://github.com/foblex/flow/commit/05ada49295eeffbef102c86ead77241ef9a7871b))

### Documentation

- Added StressTestWithConnections example ([7e7e4f5](https://github.com/foblex/flow/commit/7e7e4f5ab402b8cec84fbae5f36ff3bceb5bdd37))
- Added ConnectabilityCheck examples ([fac0ff1](https://github.com/foblex/flow/commit/fac0ff118f8f1143186f3d29174468af1fff45f1))
- Added AssignNodeToConnection example ([377b610](https://github.com/foblex/flow/commit/377b6109e6ca65f654f62976fe50b8277d7d542b))
- Added ConnectionText and CustomConnectionType examples ([eb248c0](https://github.com/foblex/flow/commit/eb248c044bf854a208e4930e405b990a24840328))
- Added ConnectionCenter examples ([9b7d1ed](https://github.com/foblex/flow/commit/9b7d1edd5b537feeb132e2564e61538c2baa784b))
- Added AddNodeToPalette example ([d1d2ab9](https://github.com/foblex/flow/commit/d1d2ab999b4f57f17a30c18a9c7b4aa15d6015c2))
- Added GridSystem example ([ec4cef8](https://github.com/foblex/flow/commit/ec4cef837158f7301b76a56d855a242b63e3c663))
- Added Undo/Redo example ([82c57cd](https://github.com/foblex/flow/commit/82c57cdf8a018c0f37921756d1801c0b0dc3d980))
- Added DragStart/EndEvents example ([87daaaa](https://github.com/foblex/flow/commit/87daaaa211360dd9d1b11e0c6a6ac27d93987d1f))
- Added CustomEventTriggers example ([015865d](https://github.com/foblex/flow/commit/015865d2bf2ba75483fed2c28bacc827d646a116))
- Updated ResizeHandle example ([6735cf5](https://github.com/foblex/flow/commit/6735cf5dd636dad4838032765f5da862763d6f1f))
- Updated AutoSnap example ([fcfce91](https://github.com/foblex/flow/commit/fcfce91ea082d503d54f982fd624bded6838e3fc))

## [17.0.1](https://github.com/foblex/flow/compare/v16.0.0...v17.0.1) (2024-12-29)

### Features

- Removed RXJS dependency ([52811e3](https://github.com/foblex/flow/commit/52811e35e1828448c72935384c7e034f35b08461))
- Positioning support for fText ([52811e3](https://github.com/foblex/flow/commit/52811e35e1828448c72935384c7e034f35b08461))

### Bug Fixes

- IOS issue with recalculate after animation ([369c54d](https://github.com/foblex/flow/commit/369c54debdf2fad87a3cbcb82343aea04d3ac2dc))

### Documentation

- Added AutoSnap example ([7e7e4f5](https://github.com/foblex/flow/commit/7e7e4f5ab402b8cec84fbae5f36ff3bceb5bdd37))
- Added Background example ([6735cf5](https://github.com/foblex/flow/commit/6735cf5dd636dad4838032765f5da862763d6f1f))
- Added ConnectionBehaviours examples ([fac0ff1](https://github.com/foblex/flow/commit/fac0ff118f8f1143186f3d29174468af1fff45f1))
- Added ConnectionMarkers example ([377b610](https://github.com/foblex/flow/commit/377b6109e6ca65f654f62976fe50b8277d7d542b))
- Added ConnectionType and CustomConnectionType examples ([eb248c0](https://github.com/foblex/flow/commit/eb248c044bf854a208e4930e405b990a24840328))
- Added Connector examples ([9b7d1ed](https://github.com/foblex/flow/commit/9b7d1edd5b537feeb132e2564e61538c2baa784b))
- Added CustomConnections example ([fcfce91](https://github.com/foblex/flow/commit/fcfce91ea082d503d54f982fd624bded6838e3fc))
- Added DragToGroup example ([d1d2ab9](https://github.com/foblex/flow/commit/d1d2ab999b4f57f17a30c18a9c7b4aa15d6015c2))
- Added HelpInPositioning example ([ec4cef8](https://github.com/foblex/flow/commit/ec4cef837158f7301b76a56d855a242b63e3c663))
- Added Minimap example ([82c57cd](https://github.com/foblex/flow/commit/82c57cdf8a018c0f37921756d1801c0b0dc3d980))
- Added NodeSelection example ([87daaaa](https://github.com/foblex/flow/commit/87daaaa211360dd9d1b11e0c6a6ac27d93987d1f))
- Added RemoveOnDrop and CreateOnDrop examples ([015865d](https://github.com/foblex/flow/commit/015865d2bf2ba75483fed2c28bacc827d646a116))
- Added SelectionArea example ([71bf4fc](https://github.com/foblex/flow/commit/71bf4fcc6ec74189439b926fa3d544b4ca6da569))
- Added TournamentBracket example ([a934e8c](https://github.com/foblex/flow/commit/a934e8c015d50541d3d19865251feb0c78281294))
- Added UmlDiagram example ([1f48560](https://github.com/foblex/flow/commit/1f485605f38606952fa4e6e4c23aba32813428bd))
- Added Zoom example ([044452f](https://github.com/foblex/flow/commit/044452f4f868e9772be3b14619ef4ebcdae46cbf))

### Tests

- Added E2E tests: DragHandle, DragToConnect, DragToReassign ([3513d63](https://github.com/foblex/flow/commit/3513d63d78c45e7d3f6a327f39aa7c58ecaacd51))
- Fixed: RemoveOnDrop and DragToReassign tests ([a1a2a79](https://github.com/foblex/flow/commit/a1a2a798e0059d5cb1815289427c3bb1cc734c8d))

## [16.0.0](https://github.com/foblex/flow/compare/v12.6.0...v16.0.0) (2024-09-24)

### Features

- Added centerNodeOrGroup functionality https://github.com/Foblex/f-flow/discussions/44 ([131ae19](https://github.com/foblex/flow/commit/131ae196ab84206c7ae7884b0b288a23b23f5edd))
- Added getFlowState functionality https://github.com/Foblex/f-flow/issues/46 ([c5841fd](https://github.com/foblex/flow/commit/c5841fdd96683f195b09421870569cd3316aa7c3))
- Added Server Side Rendering (SSR) support ([ba73083](https://github.com/foblex/flow/commit/ba7308383ec498f2ce79718d502ec75bd220a1b8))
- Added snap connection to create functionality ([82b3872](https://github.com/foblex/flow/commit/82b38725db63093c2a126867345d2780049492c3))
- Added snap connection to reassign functionality ([37972df](https://github.com/foblex/flow/commit/37972df1ccf933d0590d8efa8cc253b17f462464))
- Added SSR support to m-render ([a3d6595](https://github.com/foblex/flow/commit/a3d6595fb28df1e8bfd61ccc8e989ec26e43f58d))
- Changed imports from @foblex/core to @foblex/mediator, @foblex/platform, @foblex/2d ([30a60da](https://github.com/foblex/flow/commit/30a60da2e64aa87be52e6fb90f06f780b2dc0777))
- Changed imports from @foblex/core to @foblex/utils, @foblex/drag-toolkit ([26d9631](https://github.com/foblex/flow/commit/26d96313b86d068d9912b3c6ff28ca0fa6c14039))
- Cleanup after delete @foblex/core ([9aa5717](https://github.com/foblex/flow/commit/9aa5717434849c1a9b612e503d67c1a893b6b6e3))
- Updated f-canvas user api ([978d764](https://github.com/foblex/flow/commit/978d76486d51c6d2cb75f617e15cc2b3dc75e43d))

### Bug Fixes

- Fixed After adding a Node, all the connections disappear https://github.com/Foblex/f-flow/issues/51 ([c47621d](https://github.com/foblex/flow/commit/c47621d336b69ddeedb38ee6bb5083b399962eee))
- Fixed Cannot access 'AddPatternToBackgroundExecution' before initialization https://github.com/Foblex/f-flow/issues/53 ([ecfed74](https://github.com/foblex/flow/commit/ecfed74aa6fbf509324cea14cc648aeb14c4c043))
- Fixed create connection target incorrect position with scale ([ec323c5](https://github.com/foblex/flow/commit/ec323c53a5d36ccbe30fe6d07fa229606ba73277))
- Fixed doesn't work for angular 12 https://github.com/Foblex/f-flow/issues/48 ([70064b0](https://github.com/foblex/flow/commit/70064b059b65c4f7d64b269d6a2bc0f11e0ca3b0))
- Fixed tests after removing @foblex/core ([60a4e92](https://github.com/foblex/flow/commit/60a4e92fccc4d1ef0dafcc9d72bf47d6ab64f1f4))
- Fixed undefined snap connection ([739f414](https://github.com/foblex/flow/commit/739f4144e5c2df608410b87924be12fac5ae793e))

### Tests

- Added FindClosestInputUsingSnapThresholdExecution tests ([bcf1bda](https://github.com/foblex/flow/commit/bcf1bda003e67483b96b5de87c7cdf8bbe328a34))

### Documentation

- Added center node or group functionality ([01584c1](https://github.com/foblex/flow/commit/01584c1355217224541c4db9fc2c25c69197dd7f))
- Added custom nodes example ([6f2bd7b](https://github.com/foblex/flow/commit/6f2bd7bde46f901bbe773a550c92de86160fb01f))
- Added drag to connect and drag to reassign examples ([afdd469](https://github.com/foblex/flow/commit/afdd4693f0fdd545ef3015c01abbdcfb1c17b405))
- Added drag-handle example ([8fb4399](https://github.com/foblex/flow/commit/8fb4399ac1fc6749efbf550af5beee81086cc27d))
- Added grouping example ([766e456](https://github.com/foblex/flow/commit/766e45652a6962be3118b77f00d4a4f580c36ef3))
- Added resize handle example ([4f23af5](https://github.com/foblex/flow/commit/4f23af534549fb0630d6db0e8e9a282cf734e617))
- Added snap-connection documentation and example ([dd4895f](https://github.com/foblex/flow/commit/dd4895fb50d5385e506579c1ee03167259141f19))

## [12.6.0](https://github.com/foblex/flow/compare/v12.5.0...v12.6.0) (2024-09-07)

### Features

- Added dagre layout example ([737dd1f](https://github.com/foblex/flow/commit/737dd1f1a13895f29e38656cfab238d5d2659eb7))
- Added db management flow example ([4a605a3](https://github.com/foblex/flow/commit/4a605a32c4f20e00b533dafb7de7d3de28d3e358))
- Added elkjs layout example ([9695e08](https://github.com/foblex/flow/commit/9695e0838d0572410d2514f2b1b17f2884e823a8))
- Added examples common styles ([5e96e98](https://github.com/foblex/flow/commit/5e96e983f803ed5678802c08d6057cde75e087c6))
- Added f-group functionality ([8a3c8ce](https://github.com/foblex/flow/commit/8a3c8cebe0ddb17252b6cada15f0080dfcd971c6))
- Added fDragHandle documentation ([a655fdc](https://github.com/foblex/flow/commit/a655fdce6e5869379e80dc7da43d6bd35ea0e212))
- Modified layers sorting functionality after adding f-group ([3c60249](https://github.com/foblex/flow/commit/3c602498df9dfdcd4a5a74bc174dd23000015eca))
- Moved external item drag and drop functionality to component directory ([8b9dbb1](https://github.com/foblex/flow/commit/8b9dbb114eec8816a10e7de9494bcc6e82187911))
- Moved selection area drag and drop functionality to component directory ([121a63e](https://github.com/foblex/flow/commit/121a63e1fdc8d5bdb7be9127c0008ba9f2de14e0))
- Updated to m-render v1.2.2 ([bdaa267](https://github.com/foblex/flow/commit/bdaa267a705b701cbd5bb0886940f925412a79bd))

### Bug Fixes

- Fixed dagre layout trackby unique key ([102a771](https://github.com/foblex/flow/commit/102a771474654b07a3fe8f12c34ef07d900d2364))
- Foblex Core is unable to slide the schema [#37](https://github.com/foblex/flow/issues/37) ([55a4070](https://github.com/foblex/flow/commit/55a407095c39d2428ce3b84d8cd448558dffb993))
- Prevent selection when drag fExternalItem ([036e192](https://github.com/foblex/flow/commit/036e1921bd3f539dd93a03f724f0c5331f8a636d))

### Documentation

- Added custom connection type example ([b574306](https://github.com/foblex/flow/commit/b574306a7522c201d1b0274dd983f95a6a64b9fb))
- Added db-management-flow dark theme ([1f8fe45](https://github.com/foblex/flow/commit/1f8fe45009ded71f6d825c6a6b49910ae1b0ec06))
- Added f-group to db-management example ([65902f5](https://github.com/foblex/flow/commit/65902f59dcc07cc465beecc5b18046f763c6ca64))
- Added group example ([dfd428b](https://github.com/foblex/flow/commit/dfd428b84808df863714920dd9dc60a525bdc0e7))
- Added node with connectors example ([fb3bcb7](https://github.com/foblex/flow/commit/fb3bcb79ccf914b87c2e12888cdb25b993c42a83))
- Updated Output and Input Documentation ([d942f88](https://github.com/foblex/flow/commit/d942f889a3906c287b1e7f783f40e5034c5fb716))

### Tests

- Added test to change items layers functionality ([01f27dd](https://github.com/foblex/flow/commit/01f27dd852c5d9c495b010e2144fa7241da31252))

## [12.5.0](https://github.com/foblex/flow/compare/v12.3.9...v12.5.0) (2024-08-11)

### Features

- Add various site icons and upgrade library to Zoneless ([e561e69](https://github.com/foblex/flow/commit/e561e6972a723ea299005518057963ba260961af))
- Added minimap functionality ([f5eece6](https://github.com/foblex/flow/commit/f5eece6df6e556a0ec0bbfa26ec623ce368f60ef))
- Added Zoneless support ([a8c5812](https://github.com/foblex/flow/commit/a8c581285d8c9e6f246cbd2f2a07c346ce1ba131))
- Update to m-render v1.2.1 ([8067764](https://github.com/foblex/flow/commit/80677640c5d917b564964987b575d9fb28e28ce5))

### Documentation

- Added minimap documentation ([ccbdb99](https://github.com/foblex/flow/commit/ccbdb990935d0d9ae04d92de47752b50a6b11190))
- Added minimap examples ([5646066](https://github.com/foblex/flow/commit/56460662d015f4ba0e6269d8f6bbc0de6e7b058f))
- Remove old changelogs and switch to standard-version ([ff5b9e5](https://github.com/foblex/flow/commit/ff5b9e53c342ee7403813ce807e38d55a350725b))

## [12.4.0] - 2024-08-05

### Bug Fixes

- Incorrect canvas position when using canvas.fitToScreen ([#28](https://github.com/Foblex/f-flow/issues/28))
- Items outside the flow are selected when dragging fExternalItem ([#27](https://github.com/Foblex/f-flow/issues/27))
- Fixed incorrect rendering of connection lines in complex layouts.

### Features

- Describe documentation on how to add a custom background ([#9](https://github.com/Foblex/f-flow/issues/9))
- Added support for multi-layered canvas backgrounds.

## [12.3.0] - 2024-07-20

### Bug Fixes

- Resolved issues with node animations causing performance drops.
- Fixed bug where context menu would not appear in certain conditions.

## [12.2.2] - 2024-06-13

### Bug Fixes

- Move selected items without pressing ctrl ([#10](https://github.com/Foblex/f-flow/issues/10))
- Fixed issue with node snapping to grid not working properly.
- Resolved performance issues when handling large numbers of nodes.

### Features

- Create connection with undefined fInput when user drops connection on the canvas.
- Added option to customize node colors dynamically.

## [12.2.1] - 2024-05-30

### Bug Fixes

- Corrected display problems with mat-tooltips on smaller screens.

### Features

- Added new layout options for better node organization.

## [12.2.0] - 2024-04-25

### Features

- Custom connection types ([#6](https://github.com/Foblex/f-flow/issues/6))
- Introduced new node resizing handles for better UX.

## [12.1.5] - 2024-04-10

### Bug Fixes

- Fixed issue with nodes overlapping when auto-arrange is used.
- Improved stability of the canvas rendering engine.

### Features

- Added support for custom node shapes.

## [12.1.0] - 2024-03-28

### Bug Fixes

- Resolved issues with drag-and-drop functionality in nested containers.
- Fixed alignment issues with text labels on nodes.

## [12.0.7] - 2024-03-26

### Bug Fixes

- fOutlet directive to allow multiple connections.
- Corrected alignment issues with the connection labels.

## [12.0.1] - 2024-03-20

### Bug Fixes

- fitToParent mixin toCenter parameter in scaled context.
- Fixed bugs related to zooming and panning in the canvas.

## [1.5.2] - 2024-03-14

### Bug Fixes

- Change id attributes for connectors to data attributes.
- Improved error handling for connection failures.

## [1.5.1] - 2024-03-12

### Bug Fixes

- Change id attributes to fId.
- Resolved issues with duplicate node IDs causing conflicts.

### Features

- Segment connection type.
- Bezier connection type.
- FConnectionCenterComponent.
- FConnectionCenterDirective.

## [1.4.0] - 2024-02-28

### Bug Fixes

- Fixed issues with the selection area being inaccurate.
- Corrected mat-tooltips not displaying for all node types.

### Features

- Added batch node editing capabilities.
- Introduced dark mode for the entire interface.

## [1.3.4] - 2024-02-23

### Bug Fixes

- Issue with the selection area not being removed after dragging.
- FNodeDirective instead of FNodeComponent.
- Fixed minor UI glitches in the node editor.

## [1.3.0] - 2024-01-10

### Features

- Selection Area functionality.
- Added keyboard shortcuts for faster node manipulation.

### Bug Fixes

- Single selection issue after dragging.
- Fixed inconsistencies in node alignment after dragging.

## [1.2.2] - 2023-10-12

### Bug Fixes

- fitToParent mixin in scaled context.
- oneToOne mixin in scaled context.
- Fixed issue with connection points not aligning correctly.

### Features

- Line Alignment component.
- Added support for snapping nodes to guidelines.

## [1.2.0] - 2023-08-30

### Bug Fixes

- Fixed rendering issues with high DPI screens.
- Corrected problem with nodes not saving their state properly.

### Features

- Introduced node grouping functionality.
- Added ability to lock nodes in place.

## [1.1.0] - 2023-06-15

### Bug Fixes

- Resolved conflicts when merging nodes with similar attributes.

### Features

- New theme options for customizing the look and feel of the canvas.
- Added real-time collaboration indicators.

## [1.0.2] - 2023-02-02

### Features

- Reassign connection functionality.
- Introduced basic node editing capabilities.
