describe('ConnectorOutlet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connector-outlet');
    cy.get('f-flow').scrollIntoView();
  });

  it('should create connection from outlet and clear it', () => {
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 0);
    cy.contains('f-checkbox', 'Draw connection from outlet').click({ force: true });

    cy.get('.f-node-outlet')
      .first()
      .then(($outlet: JQuery<HTMLElement>) => {
        const outletRect = $outlet[0].getBoundingClientRect();
        const startX = outletRect.left + outletRect.width / 2;
        const startY = outletRect.top + outletRect.height / 2;

        cy.get('[data-f-input-id="1"]')
          .first()
          .then(($input: JQuery<HTMLElement>) => {
            const inputRect = $input[0].getBoundingClientRect();
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            cy.wrap($outlet)
              .trigger('mousedown', {
                button: 0,
                clientX: startX,
                clientY: startY,
                force: true,
              })
              .trigger('mousemove', {
                clientX: startX + 5,
                clientY: startY + 5,
                force: true,
              });

            cy.get('body')
              .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
              .trigger('pointerup', { clientX: endX, clientY: endY, force: true });
          });
      });

    cy.get('.f-connection:not(.f-connection-for-create)', { timeout: 4000 }).should(
      'have.length',
      1,
    );

    cy.contains('.f-button', 'Delete Connections').click();
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 0);
  });
});
