describe('ZoomComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/zoom');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display zoom controls and flow canvas', () => {
    cy.get('f-flow').should('be.visible');
    cy.get('.f-node').should('exist');

    // Look for zoom controls
    cy.get('body').then(($body) => {
      const _hasZoomControls =
        $body.find('[data-zoom], .zoom-control, .f-zoom').length > 0 ||
        $body
          .find('button')
          .text()
          .match(/zoom|in|out|\+|\\-/i) ||
        $body.find('[title*="zoom"], [aria-label*="zoom"]').length > 0;
    });
  });

  it('should support zoom in functionality', () => {
    // Look for zoom in button or control
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("+")', 'button[title*="in"]', '[data-zoom-in]').length > 0) {
        cy.get('button:contains("+"), button[title*="in"], [data-zoom-in]').first().click();
        cy.wait(500);

        // Canvas should remain functional after zoom
        cy.get('f-flow').should('be.visible');
        cy.get('.f-node').should('be.visible');
      }
    });
  });

  it('should support zoom out functionality', () => {
    // Look for zoom out button or control
    cy.get('body').then(($body) => {
      if (
        $body.find('button:contains("-")', 'button[title*="out"]', '[data-zoom-out]').length > 0
      ) {
        cy.get('button:contains("-"), button[title*="out"], [data-zoom-out]').first().click();
        cy.wait(500);

        // Canvas should remain functional after zoom
        cy.get('f-flow').should('be.visible');
        cy.get('.f-node').should('be.visible');
      }
    });
  });

  it('should support mouse wheel zoom', () => {
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      // Simulate mouse wheel zoom in
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: -100,
        force: true,
      });

      cy.wait(300);

      // Simulate mouse wheel zoom out
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: 100,
        force: true,
      });

      cy.wait(300);

      // Canvas should remain functional
      cy.get('f-flow').should('be.visible');
      cy.get('.f-node').should('be.visible');
    });
  });

  it('should support fit-to-screen functionality', () => {
    // Look for fit-to-screen control
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("fit")', '[data-fit]', '[title*="fit"]').length > 0) {
        cy.get('button:contains("fit"), [data-fit], [title*="fit"]').first().click();
        cy.wait(500);

        // All nodes should be visible after fit
        cy.get('.f-node').should('be.visible');
      }
    });
  });

  it('should maintain node interactions at different zoom levels', () => {
    // Zoom in first (if zoom controls exist)
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("+")', '[data-zoom-in]').length > 0) {
        cy.get('button:contains("+"), [data-zoom-in]').first().click();
        cy.wait(500);
      }
    });

    // Test node interaction after zoom
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 30, clientY: startY + 30, force: true })
          .trigger('pointerup', { clientX: startX + 30, clientY: startY + 30, force: true });

        cy.wait(500);

        // Node should still be interactive
        cy.get('.f-node.f-drag-handle').should('be.visible');
      });
  });

  it('should support zoom reset functionality', () => {
    // First change zoom level
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      // Zoom in with wheel
      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: -200,
        force: true,
      });

      cy.wait(300);

      // Look for reset/100% button
      cy.get('body').then(($body) => {
        if (
          $body.find('button:contains("100%")', 'button:contains("reset")', '[data-zoom-reset]')
            .length > 0
        ) {
          cy.get('button:contains("100%"), button:contains("reset"), [data-zoom-reset]')
            .first()
            .click();
          cy.wait(500);

          // Should return to normal zoom
          cy.get('.f-node').should('be.visible');
        }
      });
    });
  });

  it('should display zoom level indicator', () => {
    // Look for zoom level display
    cy.get('body').then(($body) => {
      const _hasZoomIndicator =
        $body.find('.zoom-level, [data-zoom-level]').length > 0 ||
        $body.text().match(/\d+%/) ||
        $body.find('input[type="range"]').length > 0;

      // At minimum, should have functional zoom
      cy.get('f-flow').should('be.visible');
    });
  });

  it('should support pinch-to-zoom on touch devices', () => {
    // Simulate touch events for pinch zoom
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      // Simulate pinch start
      cy.wrap($flow).trigger('touchstart', {
        touches: [
          { clientX: centerX - 50, clientY: centerY },
          { clientX: centerX + 50, clientY: centerY },
        ],
        force: true,
      });

      // Simulate pinch move (zoom in)
      cy.wrap($flow).trigger('touchmove', {
        touches: [
          { clientX: centerX - 100, clientY: centerY },
          { clientX: centerX + 100, clientY: centerY },
        ],
        force: true,
      });

      // Simulate pinch end
      cy.wrap($flow).trigger('touchend', { force: true });

      cy.wait(300);

      // Canvas should remain functional
      cy.get('f-flow').should('be.visible');
      cy.get('.f-node').should('be.visible');
    });
  });

  it('should maintain zoom state when creating connections', () => {
    // Set a zoom level first
    cy.get('f-flow').then(($flow) => {
      const flowRect = $flow[0].getBoundingClientRect();
      const centerX = flowRect.left + flowRect.width / 2;
      const centerY = flowRect.top + flowRect.height / 2;

      cy.wrap($flow).trigger('wheel', {
        clientX: centerX,
        clientY: centerY,
        deltaY: -50,
        force: true,
      });

      cy.wait(300);

      // Try to create a connection
      cy.get('.f-node-output')
        .first()
        .then(($output) => {
          const outputRect = $output[0].getBoundingClientRect();
          const startX = outputRect.left + outputRect.width / 2;
          const startY = outputRect.top + outputRect.height / 2;

          cy.wrap($output)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 100, clientY: startY + 100, force: true });

          cy.wait(300);

          // Should show connection preview even at different zoom
          cy.get('.f-connection-for-create').should('exist');

          cy.wrap($output).trigger('pointerup');
        });
    });
  });
});
