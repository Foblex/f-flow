describe('AutoSnap', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/auto-snap');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should create and delete connection', () => {
    cy.get('.f-connection:not(.f-connection-for-create):not(.f-snap-connection)').should(
      'have.length',
      0,
    );

    cy.get('.f-node-output')
      .first()
      .then(($output: JQuery<HTMLElement>) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.get('.f-node-input')
          .first()
          .then(($input: JQuery<HTMLElement>) => {
            const inputRect = $input[0].getBoundingClientRect();
            const endX = inputRect.left + inputRect.width / 2;
            const endY = inputRect.top + inputRect.height / 2;

            cy.wrap($output).trigger('mousedown', {
              button: 0,
              clientX: startX,
              clientY: startY,
              force: true,
            });

            cy.get('body')
              .trigger('mousemove', {
                clientX: startX + 2,
                clientY: startY + 2,
                force: true,
              })
              .trigger('mousemove', {
                clientX: endX,
                clientY: endY,
                force: true,
              })
              .trigger('pointerup', {
                clientX: endX,
                clientY: endY,
                force: true,
              });
          });
      });

    cy.get('.f-connection:not(.f-connection-for-create):not(.f-snap-connection)', {
      timeout: 2000,
    }).should('have.length', 1);

    cy.contains('.f-button', 'Delete Connections').click();
    cy.get('.f-connection:not(.f-connection-for-create):not(.f-snap-connection)').should(
      'have.length',
      0,
    );
  });
});
