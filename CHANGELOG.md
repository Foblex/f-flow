# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [12.6.0](https://github.com/foblex/flow/compare/v12.5.0...v12.6.0) (2024-09-07)


### Features

* Added dagre layout example ([737dd1f](https://github.com/foblex/flow/commit/737dd1f1a13895f29e38656cfab238d5d2659eb7))
* Added db management flow example ([4a605a3](https://github.com/foblex/flow/commit/4a605a32c4f20e00b533dafb7de7d3de28d3e358))
* Added elkjs layout example ([9695e08](https://github.com/foblex/flow/commit/9695e0838d0572410d2514f2b1b17f2884e823a8))
* Added examples common styles ([5e96e98](https://github.com/foblex/flow/commit/5e96e983f803ed5678802c08d6057cde75e087c6))
* Added f-group functionality ([8a3c8ce](https://github.com/foblex/flow/commit/8a3c8cebe0ddb17252b6cada15f0080dfcd971c6))
* Added fDragHandle documentation ([a655fdc](https://github.com/foblex/flow/commit/a655fdce6e5869379e80dc7da43d6bd35ea0e212))
* Modified layers sorting functionality after adding f-group ([3c60249](https://github.com/foblex/flow/commit/3c602498df9dfdcd4a5a74bc174dd23000015eca))
* Moved external item drag and drop functionality to component directory ([8b9dbb1](https://github.com/foblex/flow/commit/8b9dbb114eec8816a10e7de9494bcc6e82187911))
* Moved selection area drag and drop functionality to component directory ([121a63e](https://github.com/foblex/flow/commit/121a63e1fdc8d5bdb7be9127c0008ba9f2de14e0))
* Updated to f-docs v1.2.2 ([bdaa267](https://github.com/foblex/flow/commit/bdaa267a705b701cbd5bb0886940f925412a79bd))


### Bug Fixes

* Fixed dagre layout trackby unique key ([102a771](https://github.com/foblex/flow/commit/102a771474654b07a3fe8f12c34ef07d900d2364))
* Foblex Core is unable to slide the schema [#37](https://github.com/foblex/flow/issues/37) ([55a4070](https://github.com/foblex/flow/commit/55a407095c39d2428ce3b84d8cd448558dffb993))
* Prevent selection when drag fExternalItem ([036e192](https://github.com/foblex/flow/commit/036e1921bd3f539dd93a03f724f0c5331f8a636d))


### Documentation

* Added custom connection type example ([b574306](https://github.com/foblex/flow/commit/b574306a7522c201d1b0274dd983f95a6a64b9fb))
* Added db-management-flow dark theme ([1f8fe45](https://github.com/foblex/flow/commit/1f8fe45009ded71f6d825c6a6b49910ae1b0ec06))
* Added f-group to db-management example ([65902f5](https://github.com/foblex/flow/commit/65902f59dcc07cc465beecc5b18046f763c6ca64))
* Added group example ([dfd428b](https://github.com/foblex/flow/commit/dfd428b84808df863714920dd9dc60a525bdc0e7))
* Added node with connectors example ([fb3bcb7](https://github.com/foblex/flow/commit/fb3bcb79ccf914b87c2e12888cdb25b993c42a83))
* Updated Output and Input Documentation ([d942f88](https://github.com/foblex/flow/commit/d942f889a3906c287b1e7f783f40e5034c5fb716))


### Tests

* Added test to change items layers functionality ([01f27dd](https://github.com/foblex/flow/commit/01f27dd852c5d9c495b010e2144fa7241da31252))

## [12.5.0](https://github.com/foblex/flow/compare/v12.3.9...v12.5.0) (2024-08-11)

### Features

* Add various site icons and upgrade library to Zoneless ([e561e69](https://github.com/foblex/flow/commit/e561e6972a723ea299005518057963ba260961af))
* Added minimap functionality ([f5eece6](https://github.com/foblex/flow/commit/f5eece6df6e556a0ec0bbfa26ec623ce368f60ef))
* Added Zoneless support ([a8c5812](https://github.com/foblex/flow/commit/a8c581285d8c9e6f246cbd2f2a07c346ce1ba131))
* Update to f-docs v1.2.1 ([8067764](https://github.com/foblex/flow/commit/80677640c5d917b564964987b575d9fb28e28ce5))


### Documentation

* Added minimap documentation ([ccbdb99](https://github.com/foblex/flow/commit/ccbdb990935d0d9ae04d92de47752b50a6b11190))
* Added minimap examples ([5646066](https://github.com/foblex/flow/commit/56460662d015f4ba0e6269d8f6bbc0de6e7b058f))
* Remove old changelogs and switch to standard-version ([ff5b9e5](https://github.com/foblex/flow/commit/ff5b9e53c342ee7403813ce807e38d55a350725b))

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
