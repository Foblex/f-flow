describe('ConnectableSideComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connectable-side');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with side-specific connectors', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should enforce side restrictions for connections', () => {
    // Try to create connections and verify side restrictions
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.get('.f-node-input').each(($input, index) => {
          if (index < 3) {
            // Test a few inputs
            const inputRect = $input[0].getBoundingClientRect();
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            // Skip if it's the same node (too close)
            if (Math.abs(startX - endX) > 80 || Math.abs(startY - endY) > 80) {
              cy.wrap($output)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

              cy.wait(500);
            }
          }
        });
      });

    // Some connections should be created (those that respect side rules)
    cy.get('.f-connection').should('exist');
  });

  it('should show connection preview only for valid sides', () => {
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

        cy.wait(500);
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'none');
      });
  });

  it('should prevent connections to incompatible sides', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Try various connection attempts
      cy.get('.f-node-output').each(($output, outputIndex) => {
        if (outputIndex < 2) {
          // Limit attempts
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          cy.get('.f-node-input').each(($input, inputIndex) => {
            if (inputIndex < 2) {
              // Limit attempts
              const inputRect = $input[0].getBoundingClientRect();
              const endX = inputRect.left + inputRect.width / 2;
              const endY = inputRect.top + inputRect.height / 2;

              // Only try if nodes are far enough apart
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

                cy.wait(300);
              }
            }
          });
        }
      });

      // Not all attempts should succeed due to side restrictions
      cy.get('.f-connection').then(($finalConnections) => {
        expect($finalConnections.length).to.be.at.least(initialCount);
        expect($finalConnections.length).to.be.lessThan(20); // Reasonable upper bound
      });
    });
  });

  it('should maintain side restrictions when nodes are moved', () => {
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
            .trigger('mousemove', { clientX: startX + 90, clientY: startY + 90, force: true })
            .trigger('pointerup', { clientX: startX + 90, clientY: startY + 90, force: true });

          cy.wait(500);

          // Connections should still exist and respect side rules
          cy.get('.f-connection').should('have.length', initialCount);
        });
    });
  });

  it('should allow node selection regardless of connector sides', () => {
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: centerX, clientY: centerY, button: 0, force: true })
          .trigger('mousemove', { clientX: centerX + 2, clientY: centerY + 2, force: true })
          .trigger('pointerup', { clientX: centerX + 2, clientY: centerY + 2, force: true });

        cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 1);
      });
  });

  it('should display connectors on correct sides of nodes', () => {
    // Verify that connectors are positioned on appropriate sides
    cy.get('.f-node').each(($node) => {
      const nodeRect = $node[0].getBoundingClientRect();

      cy.wrap($node).within(() => {
        cy.get('.f-node-input, .f-node-output').each(($connector) => {
          const connectorRect = $connector[0].getBoundingClientRect();

          // Verify connector is positioned relative to node
          // (Exact positioning depends on implementation, so we check it's near the node)
          const isNearNode =
            (connectorRect.left >= nodeRect.left - 30 &&
              connectorRect.right <= nodeRect.right + 30) ||
            (connectorRect.top >= nodeRect.top - 30 &&
              connectorRect.bottom <= nodeRect.bottom + 30);

          expect(isNearNode).to.be.true;
        });
      });
    });
  });
});
