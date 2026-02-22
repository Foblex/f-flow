describe('ResizeHandle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/resize-handle');
    cy.get('f-flow').scrollIntoView();
  });

  it('should update connected path while node is being resized', () => {
    cy.get('.f-connection').should('have.length', 2);

    cy.get('.f-connection-path')
      .eq(1)
      .invoke('attr', 'd')
      .then((beforePath) => {
        cy.contains('.f-node', 'Node with all ResizeHandles')
          .find('.f-resize-handle-right-bottom')
          .first()
          .then(($handle: JQuery<HTMLElement>) => {
            const rect = $handle[0].getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            const dragX = startX + 70;
            const dragY = startY + 40;

            cy.wrap($handle).trigger('mousedown', {
              button: 0,
              clientX: startX,
              clientY: startY,
              force: true,
            });

            cy.get('body')
              .trigger('mousemove', { clientX: startX + 4, clientY: startY + 4, force: true })
              .trigger('mousemove', { clientX: dragX, clientY: dragY, force: true });

            cy.get('.f-connection-path').eq(1).invoke('attr', 'd').should('not.equal', beforePath);

            cy.get('body').trigger('pointerup', { clientX: dragX, clientY: dragY, force: true });
          });
      });
  });
});
