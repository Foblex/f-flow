describe('RemoveConnectionOnDrop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/remove-connection-on-drop');
    cy.get('f-flow').scrollIntoView();
  });

  it('should remove connection when drag handle is dropped outside node', () => {
    cy.get('.f-connection').should('have.length', 2);

    cy.get('.f-connection-drag-handle')
      .first()
      .then(($handle: JQuery<HTMLElement>) => {
        const handleRect = $handle[0].getBoundingClientRect();
        const startX = handleRect.left + handleRect.width / 2;
        const startY = handleRect.top + handleRect.height / 2;
        const endX = startX;
        const endY = startY + 120;

        cy.wrap($handle)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('pointerup', { clientX: endX, clientY: endY, force: true });
      });

    cy.get('.f-connection').should('have.length', 1);
  });
});
