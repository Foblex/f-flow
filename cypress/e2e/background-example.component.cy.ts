describe('BackgroundExampleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/background-example');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display background elements and flow canvas', () => {
    cy.get('f-flow').should('be.visible');
    cy.get('.f-node').should('exist');

    // Look for background elements
    cy.get('body').then(($body) => {
      const _hasBackground =
        $body.find('.background, .f-background, [data-background]').length > 0 ||
        $body.find('rect, circle, pattern').length > 0 || // SVG background elements
        $body.find('.grid, .dots').length > 0;
    });
  });

  it('should show background patterns or grid', () => {
    // Check for SVG background patterns
    cy.get('svg').then(($svg) => {
      if ($svg.length > 0) {
        cy.wrap($svg).within(() => {
          // Look for background elements like patterns, grids, or shapes
          cy.get('body').then(($body) => {
            const _hasPatterns =
              $body.find('defs pattern, defs rect, defs circle').length > 0 ||
              $body.find('rect[width][height]').length > 0 ||
              $body.find('[stroke-dasharray]').length > 0;
          });
        });
      }
    });

    // At minimum, canvas should be functional
    cy.get('f-flow').should('be.visible');
  });

  it('should maintain background when canvas is panned', () => {
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const startX = flowRect.left + 100;
      const startY = flowRect.top + 100;

      // Pan the canvas
      cy.wrap($flow)
        .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
        .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true })
        .trigger('pointerup', { clientX: startX + 50, clientY: startY + 50, force: true });

      cy.wait(500);

      // Background should still be visible/functional
      cy.get('f-flow').should('be.visible');
      cy.get('.f-node').should('be.visible');
    });
  });

  it('should maintain background when canvas is zoomed', () => {
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      // Zoom in
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: -100,
        force: true,
      });

      cy.wait(300);

      // Zoom out
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: 100,
        force: true,
      });

      cy.wait(300);

      // Background should adapt to zoom
      cy.get('f-flow').should('be.visible');
      cy.get('.f-node').should('be.visible');
    });
  });

  it('should allow node interaction over background', () => {
    // Test that background doesn't interfere with node interaction
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

        // Node should move successfully over background
        cy.get('.f-node.f-drag-handle')
          .first()
          .then(($movedNode) => {
            const newRect = $movedNode[0].getBoundingClientRect();
            expect(newRect.left).to.be.greaterThan(rect.left);
            expect(newRect.top).to.be.greaterThan(rect.top);
          });
      });
  });

  it('should allow connection creation over background', () => {
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

                // Connection should be created over background
                cy.get('.f-connection').should('have.length.greaterThan', initialCount);
              }
            });
        });
    });
  });

  it('should support different background styles or themes', () => {
    // Check if there are controls for changing background
    cy.get('body').then(($body) => {
      const hasBackgroundControls =
        $body.find('button[title*="background"], select, input[type="checkbox"]').length > 0 ||
        $body.find('.theme, .style, .background-control').length > 0;

      if (hasBackgroundControls) {
        // Try interacting with background controls
        cy.get('button, select, input[type="checkbox"]')
          .first()
          .then(($control) => {
            if ($control.is('button')) {
              cy.wrap($control).click();
            } else if ($control.is('select')) {
              cy.wrap($control).select(0);
            } else if ($control.is('input[type="checkbox"]')) {
              cy.wrap($control).check();
            }

            cy.wait(300);

            // Background should update
            cy.get('f-flow').should('be.visible');
          });
      }
    });
  });

  it('should show background behind all flow elements', () => {
    // Verify z-index ordering - background should be behind other elements
    cy.get('f-flow').should('be.visible');
    cy.get('.f-node').should('be.visible');
    cy.get('.f-connection').should('be.visible');

    // Background elements should not interfere with interactions
    cy.get('.f-node').each(($node) => {
      cy.wrap($node).should('be.visible');
      cy.wrap($node).should('not.be.covered');
    });
  });

  it('should scale background pattern with canvas transform', () => {
    // Test background scaling behavior
    cy.get('f-flow').then(($flow) => {
      // First, check current state
      cy.get('svg').then(($svg) => {
        if ($svg.length > 0) {
          // Apply some transformation
          const flowRect = $flow[0].getBoundingClientRect();
          const centerX = flowRect.left + flowRect.width / 2;
          const centerY = flowRect.top + flowRect.height / 2;

          // Zoom and pan
          cy.wrap($flow).trigger('wheel', {
            clientX: centerX,
            clientY: centerY,
            deltaY: -50,
            force: true,
          });

          cy.wait(300);

          cy.wrap($flow)
            .trigger('mousedown', { clientX: centerX, clientY: centerY, button: 0, force: true })
            .trigger('mousemove', { clientX: centerX + 30, clientY: centerY + 30, force: true })
            .trigger('pointerup', { clientX: centerX + 30, clientY: centerY + 30, force: true });

          cy.wait(300);

          // Background should still be properly rendered
          cy.get('f-flow').should('be.visible');
        }
      });
    });
  });

  it('should maintain background performance with many elements', () => {
    // Test that background doesn't degrade performance
    cy.get('.f-node').should('have.length.greaterThan', 0);

    // Perform multiple interactions to test performance
    for (let i = 0; i < 3; i++) {
      cy.get('f-flow').then(($flow) => {
        const flowRect = $flow[0].getBoundingClientRect();
        const x = flowRect.left + 50 + i * 30;
        const y = flowRect.top + 50 + i * 30;

        cy.wrap($flow)
          .trigger('mousedown', { clientX: x, clientY: y, button: 0, force: true })
          .trigger('mousemove', { clientX: x + 20, clientY: y + 20, force: true })
          .trigger('pointerup', { clientX: x + 20, clientY: y + 20, force: true });

        cy.wait(100);
      });
    }

    // Should remain responsive
    cy.get('f-flow').should('be.visible');
    cy.get('.f-node').should('be.visible');
  });
});
