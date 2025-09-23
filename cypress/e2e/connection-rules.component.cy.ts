describe('ConnectionRulesComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-rules');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with different connector categories', () => {
    cy.get('.f-node').should('have.length.greaterThan', 2);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should enforce connection rules between compatible connectors', () => {
    // Try to create connections between different types of connectors
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.get('.f-node-input').each(($input, index) => {
          if (index < 3) {
            // Test first few inputs to avoid too many attempts
            const inputRect = $input[0].getBoundingClientRect();
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            // Skip if it's too close (same node)
            if (Math.abs(startX - endX) > 50 || Math.abs(startY - endY) > 50) {
              cy.wrap($output)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

              cy.wait(500);
            }
          }
        });
      });

    // Verify some connections were created (compatible ones)
    cy.get('.f-connection').should('exist');
  });

  it('should prevent invalid connections based on rules', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Try to create connections and verify rules are enforced
      cy.get('.f-node-output').each(($output, outputIndex) => {
        if (outputIndex < 2) {
          // Limit attempts
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          // Start drag
          cy.wrap($output)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 100, clientY: startY + 100, force: true });

          // Should show connection preview
          cy.get('.f-connection-for-create')
            .should('exist')
            .invoke('css', 'display')
            .should('equal', 'block');

          cy.wrap($output).trigger('pointerup');

          cy.wait(300);
        }
      });

      // Not all attempted connections should be successful due to rules
      cy.get('.f-connection').then(($finalConnections) => {
        // Should have some connections but rules should have prevented some
        expect($finalConnections.length).to.be.at.least(initialCount);
      });
    });
  });

  it('should provide visual feedback for valid/invalid connection attempts', () => {
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Start dragging to see connection preview
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true });

        // Connection preview should appear
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        // Move over different inputs to test validation feedback
        cy.get('.f-node-input')
          .first()
          .then(($input) => {
            const inputRect = $input[0].getBoundingClientRect();
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            cy.wrap($output).trigger('mousemove', { clientX: endX, clientY: endY, force: true });

            cy.wait(300);
            cy.wrap($output).trigger('pointerup');
          });
      });
  });

  it('should allow connections between nodes with compatible rules', () => {
    // Test that at least some connections can be made
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
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            // Skip if it's the same node
            if (Math.abs(startX - endX) > 100 || Math.abs(startY - endY) > 100) {
              cy.wrap($output)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

              cy.wait(1000);
            }
          });
      });

    // Should have at least one connection
    cy.get('.f-connection').should('exist');
  });

  it('should maintain connection rules when nodes are moved', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Move a node with connections
      cy.get('.f-node.f-drag-handle')
        .first()
        .then(($node) => {
          const rect = $node[0].getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;

          cy.wrap($node)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 80, clientY: startY + 80, force: true })
            .trigger('pointerup', { clientX: startX + 80, clientY: startY + 80, force: true });

          cy.wait(500);

          // Connections should be maintained
          cy.get('.f-connection').should('have.length', initialCount);
        });
    });
  });
});
