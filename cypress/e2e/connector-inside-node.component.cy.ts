describe('ConnectorInsideNodeComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connector-inside-node');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display nodes with connectors positioned inside them', () => {
    cy.get('.f-node').should('have.length.greaterThan', 1);
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');

    // Verify connectors are positioned within their parent nodes
    cy.get('.f-node').each(($node) => {
      const nodeRect = $node[0].getBoundingClientRect();

      cy.wrap($node).within(() => {
        cy.get('.f-node-input, .f-node-output').each(($connector) => {
          const connectorRect = $connector[0].getBoundingClientRect();

          // Check if connector is within node bounds (with some tolerance)
          expect(connectorRect.left).to.be.greaterThan(nodeRect.left - 20);
          expect(connectorRect.right).to.be.lessThan(nodeRect.right + 20);
          expect(connectorRect.top).to.be.greaterThan(nodeRect.top - 20);
          expect(connectorRect.bottom).to.be.lessThan(nodeRect.bottom + 20);
        });
      });
    });
  });

  it('should allow creating connections from inside-node connectors', () => {
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

  it('should maintain connector positioning when dragging nodes', () => {
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        // Get initial connector positions relative to the node
        const nodeRect = $node[0].getBoundingClientRect();

        const initialConnectorOffsets = [];
        cy.wrap($node)
          .within(() => {
            cy.get('.f-node-input, .f-node-output').each(($connector, index) => {
              const connectorRect = $connector[0].getBoundingClientRect();
              initialConnectorOffsets[index] = {
                x: connectorRect.left - nodeRect.left,
                y: connectorRect.top - nodeRect.top,
              };
            });
          })
          .then(() => {
            // Drag the node
            const startX = nodeRect.left + nodeRect.width / 2;
            const startY = nodeRect.top + nodeRect.height / 2;

            cy.wrap($node)
              .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
              .trigger('mousemove', { clientX: startX + 60, clientY: startY + 60, force: true })
              .trigger('pointerup', { clientX: startX + 60, clientY: startY + 60, force: true });

            cy.wait(500);

            // Verify connectors maintained their relative positions
            cy.get('.f-node.f-drag-handle')
              .first()
              .then(($movedNode) => {
                const newNodeRect = $movedNode[0].getBoundingClientRect();

                cy.wrap($movedNode).within(() => {
                  cy.get('.f-node-input, .f-node-output').each(($connector, index) => {
                    const newConnectorRect = $connector[0].getBoundingClientRect();
                    const newOffset = {
                      x: newConnectorRect.left - newNodeRect.left,
                      y: newConnectorRect.top - newNodeRect.top,
                    };

                    // Allow small tolerance for rounding
                    expect(newOffset.x).to.be.closeTo(initialConnectorOffsets[index].x, 5);
                    expect(newOffset.y).to.be.closeTo(initialConnectorOffsets[index].y, 5);
                  });
                });
              });
          });
      });
  });

  it('should show connection previews when dragging from inside connectors', () => {
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

        cy.wrap($output).trigger('pointerup');

        cy.wait(500);
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'none');
      });
  });
});
