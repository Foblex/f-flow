describe('RotateHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/rotate-handle');
    cy.get('f-flow').scrollIntoView();
    cy.wait(500);
  });

  it('should rotate the first node using the rotate handle and change transform matrix', () => {
    cy.get('.f-node').first().then(($node: JQuery<HTMLElement>) => {
      cy.wrap($node).invoke('css', 'transform').then((initialTransform) => {
        cy.wrap($node).find('.f-rotate-handle').first().then(($handle: JQuery<HTMLElement>) => {
          const rect = $handle[0].getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;

          cy.wrap($handle)
            .trigger('mousedown', { clientX: startX, clientY: startY, button: 0, force: true })
            .trigger('mousemove', { clientX: startX + 50, clientY: startY + 50, force: true })
            .trigger('mousemove', { clientX: startX + 350, clientY: startY + 350, force: true })
            .wait(300)
            .trigger('mouseup', { force: true });

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
