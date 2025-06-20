describe('ResizeHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/resize-handle');
    cy.get('f-flow').scrollIntoView();
  });

  it('should drag fNode ResizeHandle and update node size', function () {

    cy.get('.f-node', {timeout: 500}).then(($node) => {

      cy.wrap($node).invoke('css', 'transform')
        .should('equal', 'matrix(1, 0, 0, 1, -20, -20)');
      cy.wrap($node).invoke('css', 'width')
        .should('equal', '120px');

      cy.wrap($node, {timeout: 500}).get('.f-resize-handle-left-top').first().then(($resizeHandle) => {
        const targetRect = $resizeHandle[0].getBoundingClientRect();
        const endY = targetRect.y;
        const endX = targetRect.x;

        cy.wrap($resizeHandle, {timeout: 500})
          .trigger('mousedown', {button: 0, force: true})
          .trigger('mousemove', {clientX: endX, clientY: endY, force: true})
          .trigger('mousemove', {clientY: endY + 50, clientX: endX + 50, force: true})
          .trigger('pointerup', {clientY: endY + 50, clientX: endX + 50, force: true});

        cy.wrap($node, {timeout: 500}).invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 30, 30)');

        cy.wrap($node, {timeout: 500}).invoke('css', 'width')
            .should('equal', '70px');
      });
    });
  });

  it('should drag fNode Icon ResizeHandle and update node size', function () {

    cy.get('.f-node', {timeout: 500}).filter(':has(mat-icon)').first().then(($node) => {

      cy.wrap($node).invoke('css', 'transform')
        .should('equal', `matrix(1, 0, 0, 1, 300, 200)`);
      cy.wrap($node).invoke('css', 'width')
        .should('equal', '120px');

      cy.wrap($node, {timeout: 500}).get('.f-resize-handle-left-bottom').first().then(($resizeHandle) => {
        const targetRect = $resizeHandle[0].getBoundingClientRect();
        const endY = targetRect.y;
        const endX = targetRect.x;

        cy.wrap($resizeHandle, {timeout: 500})
          .trigger('mousedown', {button: 0, force: true})
          .trigger('mousemove', {clientX: endX, clientY: endY, force: true})
          .trigger('mousemove', {clientY: endY + 50, clientX: endX + 50, force: true})
          .trigger('pointerup', {clientY: endY + 50, clientX: endX + 50, force: true});

        cy.wrap($node, {timeout: 500}).invoke('css', 'transform')
          .should('equal', 'matrix(1, 0, 0, 1, 350, 200)');

        cy.wrap($node, {timeout: 500}).invoke('css', 'width')
          .should('equal', '70px');
      });
    });
  });
});


