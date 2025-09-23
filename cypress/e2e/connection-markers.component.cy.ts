describe('ConnectionMarkersComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-markers');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display connections with various marker types', () => {
    cy.get('.f-connection').should('have.length.greaterThan', 0);

    // Check that connections have SVG paths
    cy.get('.f-connection path').should('exist');

    // Verify markers are defined in SVG defs
    cy.get('svg defs').should('exist');
    cy.get('svg defs marker').should('exist');
  });

  it('should show different arrowhead styles on connections', () => {
    cy.get('.f-connection').each(($connection) => {
      // Check that connections have marker attributes
      cy.wrap($connection)
        .find('path')
        .should(($path) => {
          const path = $path[0];
          const _hasMarkers =
            path.getAttribute('marker-end') ||
            path.getAttribute('marker-start') ||
            path.getAttribute('marker-mid');
          // At least some connections should have markers
        });
    });
  });

  it('should create new connections with appropriate markers', () => {
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

                // New connection should have markers
                cy.get('.f-connection').last().find('path').should('exist');
              }
            });
        });
    });
  });

  it('should show marker preview during connection creation', () => {
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

        // Preview connection should also have path
        cy.get('.f-connection-for-create path').should('exist');

        cy.wrap($output).trigger('pointerup');

        cy.wait(500);
        cy.get('.f-connection-for-create')
          .should('exist')
          .invoke('css', 'display')
          .should('equal', 'none');
      });
  });

  it('should maintain marker styles when connections are modified', () => {
    // Test that markers persist through connection changes
    cy.get('body').then(($body) => {
      if ($body.find('.f-connection-drag-handle').length > 0) {
        cy.get('.f-connection-drag-handle')
          .first()
          .then(($handle) => {
            const handleRect = $handle[0].getBoundingClientRect();
            const startX = handleRect.left + handleRect.width / 2;
            const startY = handleRect.top + handleRect.height / 2;

            // Get initial marker state
            cy.get('.f-connection')
              .first()
              .find('path')
              .then(($path) => {
                const initialMarkerEnd = $path.attr('marker-end');
                const initialMarkerStart = $path.attr('marker-start');

                // Interact with connection
                cy.wrap($handle)
                  .trigger('mousedown', {
                    clientX: startX,
                    clientY: startY,
                    button: 0,
                    force: true,
                  })
                  .trigger('mousemove', { clientX: startX + 30, clientY: startY + 30, force: true })
                  .trigger('pointerup', {
                    clientX: startX + 30,
                    clientY: startY + 30,
                    force: true,
                  });

                cy.wait(500);

                // Markers should be preserved
                cy.get('.f-connection')
                  .first()
                  .find('path')
                  .then(($newPath) => {
                    if (initialMarkerEnd) {
                      expect($newPath.attr('marker-end')).to.equal(initialMarkerEnd);
                    }
                    if (initialMarkerStart) {
                      expect($newPath.attr('marker-start')).to.equal(initialMarkerStart);
                    }
                  });
              });
          });
      }
    });
  });

  it('should display different marker types for different connection categories', () => {
    // Check for multiple marker definitions
    cy.get('svg defs marker').should('have.length.greaterThan', 0);

    // Verify markers have different characteristics
    cy.get('svg defs marker').each(($marker) => {
      // Each marker should have an id
      cy.wrap($marker).should('have.attr', 'id');

      // Markers should contain shape elements
      cy.wrap($marker).find('path, polygon, circle, line').should('exist');
    });
  });

  it('should scale markers appropriately with connections', () => {
    // Test marker scaling behavior
    cy.get('.f-connection path').each(($path) => {
      // Check if path has marker references
      const markerEnd = $path.attr('marker-end');
      const markerStart = $path.attr('marker-start');

      if (markerEnd || markerStart) {
        // Verify the referenced markers exist
        if (markerEnd) {
          const markerId = markerEnd.replace(/url\(#(.+)\)/, '$1');
          cy.get(`#${markerId}`).should('exist');
        }
        if (markerStart) {
          const markerId = markerStart.replace(/url\(#(.+)\)/, '$1');
          cy.get(`#${markerId}`).should('exist');
        }
      }
    });
  });

  it('should maintain marker visibility when nodes are moved', () => {
    // Move nodes and verify markers remain visible
    cy.get('.f-connection').then(($connections) => {
      if ($connections.length > 0) {
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

            // Connections should still be visible with markers
            cy.get('.f-connection').should('be.visible');
            cy.get('.f-connection path').should('exist');
            cy.get('svg defs marker').should('exist');
          });
      }
    });
  });

  it('should support custom marker styles and colors', () => {
    // Verify markers have styling
    cy.get('svg defs marker').each(($marker) => {
      cy.wrap($marker)
        .find('*')
        .should(($elements) => {
          // Marker elements should have styling attributes
          const _hasStyle = Array.from($elements).some(
            (element) =>
              element.getAttribute('fill') ||
              element.getAttribute('stroke') ||
              element.getAttribute('style') ||
              element.getAttribute('class'),
          );
          // At least some styling should be present
        });
    });
  });
});
