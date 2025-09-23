describe('NodeAsConnectorComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/node-as-connector');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes that act as connectors', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should allow connecting through node connectors', () => {
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

  it('should allow dragging nodes that serve as connectors', () => {
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 40, clientY: startY + 40, force: true })
          .trigger('pointerup', { clientX: startX + 40, clientY: startY + 40, force: true });

        cy.wait(500)
          .get('.f-node.f-drag-handle')
          .first()
          .then(($movedNode) => {
            const newRect = $movedNode[0].getBoundingClientRect();
            expect(newRect.left).to.be.greaterThan(rect.left);
            expect(newRect.top).to.be.greaterThan(rect.top);
          });
      });
  });

  it('should maintain connections when dragging connector nodes', () => {
    cy.get('.f-connection').should('exist');

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

        // Connections should still exist after moving
        cy.get('.f-connection').should('exist');
      });
  });
});
