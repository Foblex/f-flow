describe('CustomNodesComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/custom-nodes');
    cy.get('f-flow').scrollIntoView();
  });

  it('should display custom nodes with different types and styles', () => {
    cy.get('.f-node').should('have.length.greaterThan', 2);

    // Check that different node types exist
    cy.get('.f-node').should('exist');
    cy.get('.f-node-input').should('exist');
    cy.get('.f-node-output').should('exist');
  });

  it('should allow dragging custom nodes', () => {
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
          .trigger('mousemove', { clientX: startX + 50, clientY: startY + 30, force: true })
          .trigger('pointerup', { clientX: startX + 50, clientY: startY + 30, force: true });

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

  it('should support node selection on custom nodes', () => {
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

  it('should display custom styled nodes with different appearances', () => {
    // Check that nodes have custom styling
    cy.get('.f-node').should('have.css', 'position', 'absolute');

    // Verify at least some nodes have custom content or styling
    cy.get('.f-node').each(($node) => {
      cy.wrap($node).should('be.visible');
    });
  });
});
