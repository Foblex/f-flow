describe('ConnectorOutletComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connector-outlet');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with connector outlets', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should allow multiple connections through outlets', () => {
    cy.get('.f-connection').then(($initialConnections) => {
      const initialCount = $initialConnections.length;

      // Try to create a connection from outlet to another connector
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

              cy.wrap($output)
                .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
                .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
                .trigger('pointerup', { clientX: endX, clientY: endY, force: true });

              cy.wait(1000);
              cy.get('.f-connection').should('have.length.greaterThan', initialCount);
            });
        });
    });
  });

  it('should handle outlet-specific connector behavior', () => {
    // Test that outlets can route multiple connections
    cy.get('.f-node-output').should('be.visible');
    cy.get('.f-node-input').should('be.visible');

    // Verify outlets are working properly by checking if connections can be made
    cy.get('.f-node-output')
      .first()
      .then(($output) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        // Start dragging from outlet
        cy.wrap($output)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true });

        // Verify connection preview appears
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'block');

        cy.wrap($output).trigger('pointerup');
      });
  });

  it('should maintain outlet functionality when nodes are moved', () => {
    // First verify we have connections
    cy.get('.f-connection').should('exist');

    // Move a node with outlets
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 70, clientY: startY + 70, force: true })
          .trigger('pointerup', { clientX: startX + 70, clientY: startY + 70, force: true });

        cy.wait(500);

        // Verify outlets still work after moving
        cy.get('.f-connection').should('exist');
        cy.get('.f-node-output').should('be.visible');
        cy.get('.f-node-input').should('be.visible');
      });
  });

  it('should allow selecting nodes with outlets', () => {
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

        cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 1);
      });
  });
});
