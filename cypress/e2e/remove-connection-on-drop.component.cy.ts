describe('RemoveConnectionOnDropComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/remove-connection-on-drop');
    cy.get('f-flow').scrollIntoView();
  })

  it('should drag connection from input to any place and remove the connection', function () {
    cy.get('#connection_f-connection-012').should('exist');
    cy.get('.f-connection').should('have.length', 2);

    cy.get('.f-connection-drag-handle').first().then(($handle) => {
      const handleRect = $handle[0].getBoundingClientRect();
      const startY = handleRect.top + handleRect.height / 2;
      const startX = handleRect.left + handleRect.width / 2;

      cy.wrap( $handle)
        .trigger('mousedown', { button: 0, clientY: startY, clientX: startX, force: true })
        .trigger('mousemove', { clientY: startY + 100, clientX: startX, force: true })
        .trigger('pointerup', { clientY: startY + 100, clientX: startX, force: true });
    });

    cy.get('#connection_f-connection-012').should('not.exist');
    cy.get('.f-connection').should('have.length', 1);
  });
})



