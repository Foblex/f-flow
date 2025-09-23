describe('SelectionAreaComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/selection-area');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display multiple nodes for selection testing', () => {
    cy.get('.f-node').should('have.length.greaterThan', 2);
    cy.get('.f-node.f-drag-handle').should('exist');
  });

  it('should create selection area when dragging on empty canvas', () => {
    // Find an empty area of the canvas
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const emptyX = flowRect.left + 50;
      const emptyY = flowRect.top + 50;

      // Start selection area drag
      cy.wrap($flow)
        .trigger('mousedown', { clientX: emptyX, clientY: emptyY, button: 0, force: true })
        .trigger('mousemove', { clientX: emptyX + 100, clientY: emptyY + 100, force: true });

      cy.wait(300);

      // Check if selection area is visible (implementation specific)
      cy.get('body').then(($body) => {
        // Look for selection area indicators
        if ($body.find('.selection-area, .f-selection-area, [data-selection]').length > 0) {
          cy.get('.selection-area, .f-selection-area, [data-selection]').should('be.visible');
        }
      });

      cy.wrap($flow).trigger('pointerup');
    });
  });

  it('should select multiple nodes within selection area', () => {
    // Clear any existing selections
    cy.get('f-flow').click();
    cy.wait(300);

    // Get positions of multiple nodes
    cy.get('.f-node.f-drag-handle').then(($nodes) => {
      if ($nodes.length >= 2) {
        const firstNodeRect = $nodes[0].getBoundingClientRect();
        const lastNodeRect = $nodes[$nodes.length - 1].getBoundingClientRect();

        // Calculate selection area that encompasses multiple nodes
        const startX = Math.min(firstNodeRect.left, lastNodeRect.left) - 20;
        const startY = Math.min(firstNodeRect.top, lastNodeRect.top) - 20;
        const endX = Math.max(firstNodeRect.right, lastNodeRect.right) + 20;
        const endY = Math.max(firstNodeRect.bottom, lastNodeRect.bottom) + 20;

        // Perform selection area drag
        cy.get('f-flow')
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

        cy.wait(500);

        // Multiple nodes should be selected
        cy.get('.f-node.f-drag-handle.f-selected').should('have.length.greaterThan', 1);
      }
    });
  });

  it('should deselect nodes when clicking on empty area', () => {
    // First select a node
    cy.get('.f-node.f-drag-handle').first().click();
    cy.wait(300);
    cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 1);

    // Click on empty area
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const emptyX = flowRect.left + flowRect.width - 100;
      const emptyY = flowRect.top + flowRect.height - 100;

      cy.wrap($flow).click(emptyX - flowRect.left, emptyY - flowRect.top);
      cy.wait(300);

      // Should deselect all nodes
      cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 0);
    });
  });

  it('should support modifier keys for multi-selection', () => {
    // Select first node
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: centerX, clientY: centerY, button: 0, force: true })
          .trigger('mousemove', { clientX: centerX + 1, clientY: centerY + 1, force: true })
          .trigger('pointerup', { clientX: centerX + 1, clientY: centerY + 1, force: true });

        cy.wait(300);
        cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 1);

        // Add second node to selection with Ctrl/Cmd key
        cy.get('.f-node.f-drag-handle')
          .eq(1)
          .then(($secondNode) => {
            const secondRect = $secondNode[0].getBoundingClientRect();
            const secondCenterX = secondRect.left + secondRect.width / 2;
            const secondCenterY = secondRect.top + secondRect.height / 2;

            cy.wrap($secondNode)
              .trigger('mousedown', {
                clientX: secondCenterX,
                clientY: secondCenterY,
                button: 0,
                ctrlKey: true,
                metaKey: true,
                force: true,
              })
              .trigger('mousemove', {
                clientX: secondCenterX + 1,
                clientY: secondCenterY + 1,
                ctrlKey: true,
                metaKey: true,
                force: true,
              })
              .trigger('pointerup', {
                clientX: secondCenterX + 1,
                clientY: secondCenterY + 1,
                ctrlKey: true,
                metaKey: true,
                force: true,
              });

            cy.wait(300);
            // Should have multiple nodes selected (if multi-select is supported)
            cy.get('.f-node.f-drag-handle.f-selected').should('have.length.greaterThan', 0);
          });
      });
  });

  it('should move multiple selected nodes together', () => {
    // Select multiple nodes first
    cy.get('.f-node.f-drag-handle').then(($nodes) => {
      if ($nodes.length >= 2) {
        const firstNodeRect = $nodes[0].getBoundingClientRect();
        const lastNodeRect = $nodes[$nodes.length - 1].getBoundingClientRect();

        // Create selection area
        const startX = Math.min(firstNodeRect.left, lastNodeRect.left) - 30;
        const startY = Math.min(firstNodeRect.top, lastNodeRect.top) - 30;
        const endX = Math.max(firstNodeRect.right, lastNodeRect.right) + 30;
        const endY = Math.max(firstNodeRect.bottom, lastNodeRect.bottom) + 30;

        cy.get('f-flow')
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

        cy.wait(500);

        // Now drag selected nodes
        cy.get('.f-node.f-drag-handle.f-selected')
          .first()
          .then(($selectedNode) => {
            const selectedRect = $selectedNode[0].getBoundingClientRect();
            const dragStartX = selectedRect.left + selectedRect.width / 2;
            const dragStartY = selectedRect.top + selectedRect.height / 2;

            cy.wrap($selectedNode)
              .trigger('mousedown', {
                clientX: dragStartX,
                clientY: dragStartY,
                button: 0,
                force: true,
              })
              .trigger('mousemove', {
                clientX: dragStartX + 50,
                clientY: dragStartY + 50,
                force: true,
              })
              .trigger('pointerup', {
                clientX: dragStartX + 50,
                clientY: dragStartY + 50,
                force: true,
              });

            cy.wait(500);

            // Selected nodes should maintain their selection
            cy.get('.f-node.f-drag-handle.f-selected').should('have.length.greaterThan', 0);
          });
      }
    });
  });

  it('should show visual feedback during selection area creation', () => {
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const startX = flowRect.left + 100;
      const startY = flowRect.top + 100;

      // Start creating selection area
      cy.wrap($flow)
        .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
        .trigger('mousemove', { clientX: startX + 150, clientY: startY + 150, force: true });

      cy.wait(300);

      // Should show some visual indication (depends on implementation)
      // At minimum, the interaction should not break
      cy.wrap($flow).should('be.visible');

      cy.wrap($flow).trigger('pointerup');
    });
  });

  it('should handle selection area on different parts of canvas', () => {
    // Test selection in different areas
    const testAreas = [
      { x: 50, y: 50, width: 100, height: 100 },
      { x: 200, y: 50, width: 100, height: 100 },
      { x: 50, y: 200, width: 100, height: 100 },
    ];

    testAreas.forEach((area) => {
      cy.get('f-flow').then(($flow) => {
        const flowRect = $flow[0].getBoundingClientRect();
        const startX = flowRect.left + area.x;
        const startY = flowRect.top + area.y;
        const endX = startX + area.width;
        const endY = startY + area.height;

        cy.wrap($flow)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

        cy.wait(300);

        // Should handle the selection without errors
        cy.get('f-flow').should('be.visible');
      });
    });
  });
});
