describe('CreateNodeOnConnectionDrop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/create-node-on-connection-drop');
    cy.get('f-flow').scrollIntoView();
  });

  it('should create node when connection is dropped on empty canvas', () => {
    cy.get('.f-node').should('have.length', 1);
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 0);

    cy.get('.f-node-output')
      .first()
      .then(($output: JQuery<HTMLElement>) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;
        const endX = startX + 140;
        const endY = startY + 60;

        cy.wrap($output)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: startX + 6, clientY: startY + 6, force: true });

        cy.get('body')
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('pointerup', { clientX: endX, clientY: endY, force: true });
      });

    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 1);
    cy.get('.f-node').should('have.length', 2);
  });
});
