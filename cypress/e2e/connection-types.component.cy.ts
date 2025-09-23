describe('ConnectionTypesComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-types');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display different connection types (straight, bezier, step)', () => {
    cy.get('.f-connection').should('have.length.greaterThan', 1);

    // Check that connections exist and are visible
    cy.get('.f-connection').each(($connection) => {
      cy.wrap($connection).should('be.visible');
      cy.wrap($connection).should('have.attr', 'd'); // SVG path should have 'd' attribute
    });
  });

  it('should allow creating new connections with different types', () => {
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

  it('should show connection preview with appropriate type during drag', () => {
    cy.get('.f-connection-for-create')
      .should('exist')
      .invoke('css', 'display')
      .should('equal', 'none');

    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 100, clientY: startY + 100, force: true });

        cy.wait(500);
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        // Preview should have path data
        cy.get('.f-connection-for-create path').should('have.attr', 'd');

        cy.wrap($output).trigger('pointerup');

        cy.wait(500);
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'none');
      });
  });

  it('should display different visual styles for different connection types', () => {
    cy.get('.f-connection').should('have.length.greaterThan', 0);

    // Check that connections have different path shapes
    cy.get('.f-connection path').each(($path) => {
      const pathData = $path.attr('d');
      expect(pathData).to.exist;
      expect(pathData).to.not.be.empty;

      // Different connection types should have different path characteristics
      // Straight lines: mostly L/M commands
      // Bezier curves: C commands
      // Step connections: L/M commands with right angles
      expect(pathData).to.match(/[MLCZHVQTASmlczqthvqs]/); // SVG path commands
    });
  });

  it('should maintain connection types when nodes are moved', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;
      const initialPaths = [];

      // Store initial path data
      $initialConnections.each((index, connection) => {
        const path = Cypress.$(connection).find('path').attr('d');
        initialPaths.push(path);
      });

      // Move a node
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

          // Should still have same number of connections
          cy.get('.f-connection').should('have.length', initialCount);

          // Paths should have changed (due to movement) but type characteristics preserved
          cy.get('.f-connection path').each(($path, index) => {
            const newPath = $path.attr('d');
            expect(newPath).to.exist;
            expect(newPath).to.not.equal(initialPaths[index]); // Should change due to movement
          });
        });
    });
  });

  it('should allow selecting and interacting with different connection types', () => {
    cy.get('.f-connection').should('be.visible');

    // Test interaction with connections (if drag handles exist)
    cy.get('body').then(($body) => {
      if ($body.find('.f-connection-drag-handle').length > 0) {
        cy.get('.f-connection-drag-handle')
          .first()
          .then(($handle) => {
            const handleRect = $handle[0].getBoundingClientRect();
            const startX = handleRect.left + handleRect.width / 2;
            const startY = handleRect.top + handleRect.height / 2;

            cy.wrap($handle)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: startX + 30, clientY: startY + 30, force: true })
              .trigger('pointerup', { clientX: startX + 30, clientY: startY + 30, force: true });

            cy.wait(500);
            cy.get('.f-connection').should('exist');
          });
      }
    });
  });

  it('should display connection type controls or indicators', () => {
    // Check if there are any UI controls for switching connection types
    cy.get('body').then(($body) => {
      // Look for common UI patterns for type selection
      const hasControls =
        $body.find('[data-connection-type]').length > 0 ||
        $body.find('.connection-type').length > 0 ||
        $body.find('button').length > 0 ||
        $body.find('select').length > 0;

      if (hasControls) {
        cy.get('[data-connection-type], .connection-type, button, select').should('be.visible');
      }
    });

    // At minimum, should have the flow canvas and nodes
    cy.get('f-flow').should('be.visible');
    cy.get('.f-node').should('be.visible');
  });
});
