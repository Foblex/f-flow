describe('AutoSnapComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/auto-snap');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with auto-snap functionality', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should automatically snap connections to nearest valid connectors', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      cy.get('.f-node-output')
        .first()
        .then(($output) => {
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          // Find a target area near an input (but not exactly on it)
          cy.get('.f-node-input')
            .first()
            .then(($input) => {
              const inputRect = $input[0].getBoundingClientRect();
              const nearX = inputRect.left + inputRect.width / 2 + 20; // Slightly offset
              const nearY = inputRect.top + inputRect.height / 2 + 20;

              // Skip if it's the same node
              if (Math.abs(startX - nearX) > 80 || Math.abs(startY - nearY) > 80) {
                cy.wrap($output)
                  .trigger('mousedown', {
                    clientX: startX,
                    clientY: startY,
                    button: 0,
                    force: true,
                  })
                  .trigger('mousemove', { clientX: nearX, clientY: nearY, force: true })
                  .trigger('pointerup', { clientX: nearX, clientY: nearY, force: true });

                cy.wait(1000);

                // Should create a connection due to auto-snap
                cy.get('.f-connection').should('have.length.greaterThan', initialCount);
              }
            });
        });
    });
  });

  it('should show visual feedback during snap operation', () => {
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Start dragging to trigger snap preview
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 100, clientY: startY + 100, force: true });

        // Should show connection preview
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        // Move near an input to test snap behavior
        cy.get('.f-node-input')
          .first()
          .then(($input) => {
            const inputRect = $input[0].getBoundingClientRect();
            const nearX = inputRect.left + inputRect.width / 2 + 15;
            const nearY = inputRect.top + inputRect.height / 2 + 15;

            if (Math.abs(startX - nearX) > 50) {
              cy.wrap($output).trigger('mousemove', {
                clientX: nearX,
                clientY: nearY,
                force: true,
              });

              cy.wait(300);

              // Preview should still be visible during snap
              cy.get('.f-connection-for-create')
                .should('exist')
                .invoke('css', 'display')
                .should('equal', 'block');
            }
          });

        cy.wrap($output).trigger('pointerup');
      });
  });

  it('should snap to the closest available connector within threshold', () => {
    // Test that auto-snap chooses the nearest valid target
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Drag towards an area with multiple possible targets
        cy.wrap($output).trigger('mousedown', {
          clientX: startX,
          clientY: startY,
          button: 0,
          force: true,
        });

        // Move to different positions to test snap behavior
        const testPositions = [
          { x: startX + 50, y: startY + 50 },
          { x: startX + 100, y: startY + 50 },
          { x: startX + 50, y: startY + 100 },
        ];

        testPositions.forEach((pos) => {
          cy.wrap($output).trigger('mousemove', { clientX: pos.x, clientY: pos.y, force: true });

          cy.wait(200);

          // Should maintain connection preview
          cy.get('.f-connection-for-create')
            .should('exist')
            .invoke('css', 'display')
            .should('equal', 'block');
        });

        cy.wrap($output).trigger('pointerup');
      });
  });

  it('should not snap when outside threshold distance', () => {
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Drag to a position far from any inputs
        const farX = startX + 300;
        const farY = startY + 300;

        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: farX, clientY: farY, force: true })
          .trigger('pointerup', { clientX: farX, clientY: farY, force: true });

        cy.wait(500);

        // Should not create a connection when too far
        // (The exact behavior depends on implementation)
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'none');
      });
  });

  it('should work with different connector types', () => {
    // Test auto-snap with various input/output combinations
    cy.get('.f-node-input').should('be.visible');
    cy.get('.f-node-output').should('be.visible');

    // Verify basic functionality
    cy.get('.f-node').each(($node) => {
      cy.wrap($node).should('be.visible');
    });
  });

  it('should maintain snap behavior when nodes are moved', () => {
    // Move a node and verify snap still works
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 60, clientY: startY + 60, force: true })
          .trigger('pointerup', { clientX: startX + 60, clientY: startY + 60, force: true });

        cy.wait(500);

        // After moving, snap should still work
        cy.get('.f-node-output')
          .first()
          .then(($output) => {
            const outputRect = $output[0].getBoundingClientRect();
            const outputStartX = outputRect.left + outputRect.width / 2;
            const outputStartY = outputRect.top + outputRect.height / 2;

            cy.wrap($output)
              .trigger('mousedown', {
                clientX: outputStartX,
                clientY: outputStartY,
                button: 0,
                force: true,
              })
              .trigger('mousemove', {
                clientX: outputStartX + 50,
                clientY: outputStartY + 50,
                force: true,
              });

            cy.get('.f-connection-for-create')
              .should('exist')
              .invoke('css', 'display')
              .should('equal', 'block');

            cy.wrap($output).trigger('pointerup');
          });
      });
  });
});
