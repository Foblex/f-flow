describe('DragToConnect', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-connect');
    cy.get('f-flow').scrollIntoView();
  });

  it('should show temporary connection while dragging from output', () => {
    cy.get('.f-node-output')
      .first()
      .then(($output: JQuery<HTMLElement>) => {
        const outputRect = $output[0].getBoundingClientRect();
        const startX = outputRect.left + outputRect.width / 2;
        const startY = outputRect.top + outputRect.height / 2;
        const dragX = startX + 120;
        const dragY = startY + 80;

        cy.get('.f-connection-for-create').should(($preview: JQuery<HTMLElement>) => {
          expect(getComputedStyle($preview[0]).display).to.equal('none');
        });

        cy.wrap($output).trigger('mousedown', {
          button: 0,
          clientX: startX,
          clientY: startY,
          force: true,
        });

        cy.get('body').trigger('mousemove', {
          clientX: dragX,
          clientY: dragY,
          force: true,
        });

        cy.wait(100);

        cy.get('.f-connection-for-create').should(($preview: JQuery<HTMLElement>) => {
          expect(getComputedStyle($preview[0]).display).to.not.equal('none');
        });

        cy.get('body').trigger('pointerup', {
          clientX: dragX,
          clientY: dragY,
          force: true,
        });

        cy.wait(100);

        cy.get('.f-connection-for-create').should(($preview: JQuery<HTMLElement>) => {
          expect(getComputedStyle($preview[0]).display).to.equal('none');
        });
      });
  });

  it('should drag from output to input and create connection', () => {
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 0);

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

            cy.get('.f-connection:not(.f-connection-for-create)', { timeout: 2000 }).should(
              'have.length',
              1,
            );
            cy.get('.f-node-output').first().should('have.class', 'f-node-output-connected');
            cy.get('.f-node-input').first().should('have.class', 'f-node-input-connected');
          });
      });
  });
});
