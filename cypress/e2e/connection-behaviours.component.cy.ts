describe('ConnectionBehavioursComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-behaviours');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display connections with different behavior settings', () => {
    cy.get('.f-connection').should('have.length.greaterThan', 0);
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should demonstrate different connection behaviors during interaction', () => {
    // Test connection preview behavior
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Start dragging to see behavior
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true });

        cy.wait(300);

        // Should show connection preview
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        // Test different positions to see behavior changes
        cy.wrap($output).trigger('mousemove', {
          clientX: startX + 100,
          clientY: startY + 100,
          force: true,
        });

        cy.wait(300);

        cy.wrap($output).trigger('mousemove', {
          clientX: startX + 150,
          clientY: startY + 50,
          force: true,
        });

        cy.wait(300);

        cy.wrap($output).trigger('pointerup');
      });
  });

  it('should create connections with specific behaviors', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      cy.get('.f-node-output')
        .first()
        .then(($output) => {
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          cy.get('.f-node-input')
            .last()
            .then(($input) => {
              const inputRect = $input[0].getBoundingClientRect();
              const endX = inputRect.left + inputRect.width / 2;
              const endY = inputRect.top + inputRect.height / 2;

              // Skip if it's the same node
              if (Math.abs(startX - endX) > 100 || Math.abs(startY - endY) > 100) {
                cy.wrap($output)
                  .trigger('mousedown', {
                    clientX: startX,
                    clientY: startY,
                    button: 0,
                    force: true,
                  })
                  .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                  .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

                cy.wait(1000);
                cy.get('.f-connection').should('have.length.greaterThan', initialCount);
              }
            });
        });
    });
  });

  it('should show hover effects on connections with behaviors', () => {
    cy.get('.f-connection')
      .first()
      .then(($connection) => {
        // Test hover behavior
        cy.wrap($connection).trigger('mouseover');
        cy.wait(300);

        // Should maintain visibility and potentially show hover effects
        cy.wrap($connection).should('be.visible');

        cy.wrap($connection).trigger('mouseout');
        cy.wait(300);
      });
  });

  it('should handle connection rerouting behavior', () => {
    // Test if connections reroute when nodes move
    cy.get('.f-connection').then(($connections) => {
      if ($connections.length > 0) {
        const initialPath = $connections.first().find('path').attr('d');

        // Move a node to test rerouting
        cy.get('.f-node.f-drag-handle')
          .first()
          .then(($node) => {
            const rect = $node[0].getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            cy.wrap($node)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: startX + 90, clientY: startY + 90, force: true })
              .trigger('pointerup', { clientX: startX + 90, clientY: startY + 90, force: true });

            cy.wait(500);

            // Connection should reroute (path should change)
            cy.get('.f-connection')
              .first()
              .find('path')
              .then(($path) => {
                const newPath = $path.attr('d');
                expect(newPath).to.not.equal(initialPath);
              });
          });
      }
    });
  });

  it('should support different snapping behaviors', () => {
    // Test snapping behavior during connection creation
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.get('.f-node-input')
          .first()
          .then(($input) => {
            const inputRect = $input[0].getBoundingClientRect();

            // Test snapping by moving near (but not exactly on) the input
            const nearX = inputRect.left + inputRect.width / 2 + 25;
            const nearY = inputRect.top + inputRect.height / 2 + 25;

            if (Math.abs(startX - nearX) > 80) {
              cy.wrap($output)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: nearX, clientY: nearY, force: true });

              cy.wait(300);

              // Should show connection preview with snapping behavior
              cy.get('.f-connection-for-create')
                .should('exist')
                .invoke('css', 'display')
                .should('equal', 'block');

              cy.wrap($output).trigger('pointerup');
            }
          });
      });
  });

  it('should handle constraint behaviors for connections', () => {
    // Test that connections respect any constraints
    cy.get('.f-node-output').each(($output, index) => {
      if (index < 2) {
        // Test first two outputs
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Try to create connection to test constraints
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 120, clientY: startY + 120, force: true });

        cy.wait(300);

        // Should show appropriate behavior based on constraints
        cy.get('.f-connection-for-create').should('exist');

        cy.wrap($output).trigger('pointerup');
        cy.wait(300);
      }
    });
  });

  it('should maintain behaviors when canvas is transformed', () => {
    // Test behaviors after canvas manipulation
    cy.get('f-flow')
      .first()
      .then(($flow) => {
        // Simulate canvas pan
        cy.wrap($flow)
          .trigger('mousedown', { clientX: 200, clientY: 200, button: 0, force: true })
          .trigger('mousemove', { clientX: 220, clientY: 220, force: true })
          .trigger('pointerup', { clientX: 220, clientY: 220, force: true });

        cy.wait(500);

        // Behaviors should still work after canvas transform
        cy.get('.f-node-output')
          .first()
          .then(($output) => {
            const outputRect = $output[0].getBoundingClientRect();
            const startX = outputRect.left + outputRect.width / 2;
            const startY = outputRect.top + outputRect.height / 2;

            cy.wrap($output)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true });

            cy.get('.f-connection-for-create')
              .should('exist')
              .invoke('css', 'display')
              .should('equal', 'block');

            cy.wrap($output).trigger('pointerup');
          });
      });
  });
});
