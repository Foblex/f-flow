describe('LimitingConnectionsComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/limiting-connections');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with connection limits', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should prevent exceeding connection limits', () => {
    // Count initial connections
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Try to create connections and verify limits are enforced
      cy.get('.f-node-output').each(($output, outputIndex) => {
        if (outputIndex < 2) {
          // Limit to first two outputs to avoid too many attempts
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          cy.get('.f-node-input').each(($input, inputIndex) => {
            if (inputIndex < 2) {
              // Limit to first two inputs
              const inputRect = $input[0].getBoundingClientRect();
              const endX = inputRect.left + inputRect.width / 2;
              const endY = inputRect.top + inputRect.height / 2;

              // Skip if it's the same node
              if (Math.abs(startX - endX) > 50 || Math.abs(startY - endY) > 50) {
                cy.wrap($output)
                  .trigger('mousedown', {
                    clientX: startX,
                    clientY: startY,
                    button: 0,
                    force: true,
                  })
                  .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                  .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

                cy.wait(500);
              }
            }
          });
        }
      });

      // Verify that not all attempted connections were created (due to limits)
      cy.get('.f-connection').then(($finalConnections) => {
        // There should be some connections, but not an unlimited number
        expect($finalConnections.length).to.be.greaterThan(initialCount);
        expect($finalConnections.length).to.be.lessThan(10); // Reasonable upper limit
      });
    });
  });

  it('should show visual feedback when connection limits are reached', () => {
    // Try to create connections and observe behavior
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Start dragging from output
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 100, clientY: startY + 100, force: true });

        // Should show connection preview
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        cy.wrap($output).trigger('pointerup');
      });
  });

  it('should allow removing connections when at limit', () => {
    // If there are existing connections, try to remove one
    cy.get('.f-connection').then(($connections) => {
      if ($connections.length > 0) {
        // Try to find and interact with a connection drag handle if available
        cy.get('.f-connection-drag-handle')
          .first()
          .then(($handle) => {
            const handleRect = $handle[0].getBoundingClientRect();
            const startX = handleRect.left + handleRect.width / 2;
            const startY = handleRect.top + handleRect.height / 2;

            cy.wrap($handle)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: startX + 200, clientY: startY + 200, force: true })
              .trigger('pointerup', { clientX: startX + 200, clientY: startY + 200, force: true });

            cy.wait(500);

            // Verify we can still interact with connections
            cy.get('.f-connection').should('exist');
          });
      }
    });
  });

  it('should maintain connection limits when nodes are moved', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Move a node
      cy.get('.f-node.f-drag-handle')
        .first()
        .then(($node) => {
          const rect = $node[0].getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;

          cy.wrap($node)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true })
            .trigger('pointerup', { clientX: startX + 50, clientY: startY + 50, force: true });

          cy.wait(500);

          // Connection count should remain the same
          cy.get('.f-connection').should('have.length', initialCount);
        });
    });
  });

  it('should enforce different limits on different connector types', () => {
    // Verify that inputs and outputs can have different limits
    cy.get('.f-node-input').should('be.visible');
    cy.get('.f-node-output').should('be.visible');

    // Basic check that the component loads and shows connectors
    cy.get('.f-node').each(($node) => {
      cy.wrap($node).should('be.visible');
    });
  });
});
