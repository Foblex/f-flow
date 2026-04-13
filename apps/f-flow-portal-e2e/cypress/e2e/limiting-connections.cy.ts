describe('LimitingConnections', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/limiting-connections');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  function dragToInput(outputId: string, inputId: string): void {
    cy.get(`[data-f-output-id="${outputId}"]`)
      .first()
      .then(($output: JQuery<HTMLElement>) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;

        cy.get(`[data-f-input-id="${inputId}"]`)
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
  }

  it('should prevent second connection from single-output connector', () => {
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 0);

    dragToInput('1', '1');
    cy.get('.f-connection:not(.f-connection-for-create)', { timeout: 2000 }).should(
      'have.length',
      1,
    );

    dragToInput('1', '2');
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 1);
  });
});
