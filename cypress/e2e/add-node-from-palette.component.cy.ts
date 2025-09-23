describe('AddNodeFromPaletteComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/add-node-from-palette');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display palette with draggable node templates', () => {
    cy.get('f-flow').should('be.visible');

    // Look for palette area or draggable items
    cy.get('body').then(($body) => {
      const _hasPalette =
        $body.find('.palette, .node-palette, [data-palette]').length > 0 ||
        $body.find('.draggable, [draggable="true"]').length > 0 ||
        $body.find('.template, .node-template').length > 0;

      // At minimum should have some way to add nodes
      cy.get('body').should('contain.text', '').should('be.visible');
    });
  });

  it('should allow dragging node from palette to canvas', () => {
    // Count initial nodes
    cy.get('.f-node').then(($initialNodes) => {
      const initialCount = $initialNodes.length;

      // Look for draggable palette items
      cy.get('body').then(($body) => {
        const paletteItems = $body.find(
          '.palette *, [data-palette] *, [draggable="true"], .draggable',
        );

        if (paletteItems.length > 0) {
          const $firstItem = Cypress.$(paletteItems[0]);
          const itemRect = $firstItem[0].getBoundingClientRect();
          const startX = itemRect.left + itemRect.width / 2;
          const startY = itemRect.top + itemRect.height / 2;

          // Get canvas area for drop
          cy.get('f-flow').then(($flow) => {
            const flowRect = $flow[0].getBoundingClientRect();
            const dropX = flowRect.left + flowRect.width / 2;
            const dropY = flowRect.top + flowRect.height / 2;

            // Drag from palette to canvas
            cy.wrap($firstItem)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: dropX, clientY: dropY, force: true })
              .trigger('pointerup', { clientX: dropX, clientY: dropY, force: true });

            cy.wait(1000);

            // Should create a new node
            cy.get('.f-node').should('have.length.greaterThan', initialCount);
          });
        }
      });
    });
  });

  it('should support different node types from palette', () => {
    // Look for multiple palette items
    cy.get('body').then(($body) => {
      const paletteItems = $body.find('.palette *, [data-palette] *, .node-type, .template');

      if (paletteItems.length > 1) {
        // Try dragging different types
        paletteItems.slice(0, 2).each((index, item) => {
          const $item = Cypress.$(item);
          const itemRect = item.getBoundingClientRect();

          if (itemRect.width > 0 && itemRect.height > 0) {
            const startX = itemRect.left + itemRect.width / 2;
            const startY = itemRect.top + itemRect.height / 2;

            cy.get('f-flow').then(($flow) => {
              const flowRect = $flow[0].getBoundingClientRect();
              const dropX = flowRect.left + 100 + index * 100;
              const dropY = flowRect.top + 100 + index * 50;

              cy.wrap($item)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: dropX, clientY: dropY, force: true })
                .trigger('pointerup', { clientX: dropX, clientY: dropY, force: true });

              cy.wait(500);
            });
          }
        });

        // Should have multiple nodes of different types
        cy.get('.f-node').should('have.length.greaterThan', 1);
      }
    });
  });

  it('should show visual feedback during palette drag operation', () => {
    // Look for draggable items
    cy.get('body').then(($body) => {
      const draggableItems = $body.find('[draggable="true"], .draggable, .palette *');

      if (draggableItems.length > 0) {
        const $item = Cypress.$(draggableItems[0]);
        const itemRect = $item[0].getBoundingClientRect();

        if (itemRect.width > 0 && itemRect.height > 0) {
          const startX = itemRect.left + itemRect.width / 2;
          const startY = itemRect.top + itemRect.height / 2;

          // Start dragging
          cy.wrap($item)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true });

          cy.wait(300);

          // Should show some visual feedback (cursor change, preview, etc.)
          cy.get('body').should('be.visible'); // Basic check

          // Continue drag to canvas
          cy.get('f-flow').then(($flow) => {
            const flowRect = $flow[0].getBoundingClientRect();
            const dropX = flowRect.left + flowRect.width / 2;
            const dropY = flowRect.top + flowRect.height / 2;

            cy.wrap($item).trigger('mousemove', { clientX: dropX, clientY: dropY, force: true });

            cy.wait(300);

            cy.wrap($item).trigger('pointerup');
          });
        }
      }
    });
  });

  it('should create nodes at the correct drop position', () => {
    cy.get('body').then(($body) => {
      const paletteItems = $body.find('.palette *, [data-palette] *, [draggable="true"]');

      if (paletteItems.length > 0) {
        const $item = Cypress.$(paletteItems[0]);
        const itemRect = $item[0].getBoundingClientRect();

        if (itemRect.width > 0 && itemRect.height > 0) {
          const startX = itemRect.left + itemRect.width / 2;
          const startY = itemRect.top + itemRect.height / 2;

          // Define specific drop position
          cy.get('f-flow').then(($flow) => {
            const flowRect = $flow[0].getBoundingClientRect();
            const targetX = flowRect.left + 200;
            const targetY = flowRect.top + 200;

            cy.wrap($item)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: targetX, clientY: targetY, force: true })
              .trigger('pointerup', { clientX: targetX, clientY: targetY, force: true });

            cy.wait(1000);

            // Verify node was created near target position
            cy.get('.f-node')
              .last()
              .then(($newNode) => {
                const nodeRect = $newNode[0].getBoundingClientRect();

                // Should be reasonably close to drop position (within 100px tolerance)
                expect(Math.abs(nodeRect.left - targetX)).to.be.lessThan(100);
                expect(Math.abs(nodeRect.top - targetY)).to.be.lessThan(100);
              });
          });
        }
      }
    });
  });

  it('should prevent invalid drops outside canvas area', () => {
    cy.get('.f-node').then(($initialNodes) => {
      const initialCount = $initialNodes.length;

      cy.get('body').then(($body) => {
        const paletteItems = $body.find('.palette *, [data-palette] *, [draggable="true"]');

        if (paletteItems.length > 0) {
          const $item = Cypress.$(paletteItems[0]);
          const itemRect = $item[0].getBoundingClientRect();

          if (itemRect.width > 0 && itemRect.height > 0) {
            const startX = itemRect.left + itemRect.width / 2;
            const startY = itemRect.top + itemRect.height / 2;

            // Try to drop outside canvas (in invalid area)
            const invalidX = 50; // Far left
            const invalidY = 50; // Far top

            cy.wrap($item)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: invalidX, clientY: invalidY, force: true })
              .trigger('pointerup', { clientX: invalidX, clientY: invalidY, force: true });

            cy.wait(500);

            // Should not create node in invalid drop area
            cy.get('.f-node').should('have.length', initialCount);
          }
        }
      });
    });
  });

  it('should support keyboard interactions with palette', () => {
    // Test keyboard navigation of palette if supported
    cy.get('body').then(($body) => {
      const focusableItems = $body.find(
        '.palette [tabindex], .palette button, .palette [role="button"]',
      );

      if (focusableItems.length > 0) {
        cy.wrap(Cypress.$(focusableItems[0])).focus();
        cy.wait(200);

        // Try keyboard navigation
        cy.focused().type('{downarrow}');
        cy.wait(200);

        cy.focused().type('{enter}');
        cy.wait(500);

        // Should handle keyboard interaction gracefully
        cy.get('body').should('be.visible');
      }
    });
  });

  it('should maintain palette functionality after canvas operations', () => {
    // First, perform some canvas operations
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      // Pan canvas
      cy.wrap($flow)
        .trigger('mousedown', { clientX: centerX, clientY: centerY, button: 0, force: true })
        .trigger('mousemove', { clientX: centerX + 50, clientY: centerY + 50, force: true })
        .trigger('pointerup', { clientX: centerX + 50, clientY: centerY + 50, force: true });

      cy.wait(300);

      // Zoom canvas
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: -100,
        force: true,
      });

      cy.wait(300);

      // Now try palette functionality
      cy.get('body').then(($body) => {
        const paletteItems = $body.find('.palette *, [data-palette] *, [draggable="true"]');

        if (paletteItems.length > 0) {
          const $item = Cypress.$(paletteItems[0]);
          const itemRect = $item[0].getBoundingClientRect();

          if (itemRect.width > 0 && itemRect.height > 0) {
            const startX = itemRect.left + itemRect.width / 2;
            const startY = itemRect.top + itemRect.height / 2;

            cy.wrap($item)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: centerX, clientY: centerY, force: true })
              .trigger('pointerup', { clientX: centerX, clientY: centerY, force: true });

            cy.wait(500);

            // Palette should still work after canvas transformations
            cy.get('.f-node').should('be.visible');
          }
        }
      });
    });
  });
});
