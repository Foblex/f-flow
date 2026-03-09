describe('RotateHandle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/rotate-handle');
    cy.get('f-flow').scrollIntoView();
    cy.wait(300);
  });

  it('should rotate node when rotate handle is dragged', () => {
    cy.get('.f-node')
      .first()
      .then(($node: JQuery<HTMLElement>) => {
        cy.wrap($node)
          .invoke('css', 'transform')
          .then((initialTransform) => {
            cy.wrap($node)
              .find('.f-rotate-handle')
              .first()
              .then(($handle: JQuery<HTMLElement>) => {
                const rect = $handle[0].getBoundingClientRect();
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;

                cy.wrap($handle)
                  .trigger('mousedown', {
                    button: 0,
                    clientX: startX,
                    clientY: startY,
                    force: true,
                  })
                  .trigger('mousemove', {
                    clientX: startX + 50,
                    clientY: startY + 50,
                    force: true,
                  })
                  .trigger('mousemove', {
                    clientX: startX + 300,
                    clientY: startY + 200,
                    force: true,
                  })
                  .trigger('pointerup', {
                    clientX: startX + 300,
                    clientY: startY + 200,
                    force: true,
                  });

                cy.wrap($node)
                  .invoke('css', 'transform')
                  .should((afterTransform) => {
                    expect(afterTransform).to.not.equal(initialTransform);
                  });
              });
          });
      });
  });
});
